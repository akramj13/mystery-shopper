import * as cheerio from "cheerio";
import { GoogleGenAI } from "@google/genai";
import {
  StyleData,
  LayoutInfo,
  UIComponents,
  SiteAnalysis,
  AnalysisResult,
} from "@/types/critique";

export async function POST(req: Request) {
  const { url } = await req.json();

  try {
    // Fetch the HTML content
    const html = await fetch(url).then((res) => res.text());
    const $ = cheerio.load(html);

    // Extract HTML content
    const bodyText = $("body").text().replace(/\s+/g, " ");

    // Extract CSS information
    const stylesData: StyleData[] = [];

    // Get inline styles
    $("[style]").each((_, element) => {
      const el = $(element);
      stylesData.push({
        element: el.prop("tagName"),
        class: el.attr("class") || "",
        style: el.attr("style"),
      });
    });

    // Get styles from style tags
    $("style").each((_, element) => {
      stylesData.push({
        type: "style tag",
        content: $(element).html(),
      });
    });

    // Get external stylesheet URLs
    const stylesheetUrls: string[] = [];
    $("link[rel='stylesheet']").each((_, element) => {
      const href = $(element).attr("href");
      if (href) stylesheetUrls.push(href);
    });

    // Extract color scheme
    const colors = new Set<string>();
    const colorRegex =
      /#([0-9a-f]{3}){1,2}\b|rgb\([\d,\s]+\)|rgba\([\d,\s\.]+\)|hsl\([\d,\s%\.]+\)|hsla\([\d,\s%\.]+\)|[a-z]+-[a-z]+|[a-z]+/gi;

    // Extract from style tags
    $("style").each((_, element) => {
      const styleContent = $(element).html() || "";
      const matches = styleContent.match(colorRegex) || [];
      matches.forEach((color) => colors.add(color));
    });

    // Extract from inline styles
    $("[style]").each((_, element) => {
      const style = $(element).attr("style") || "";
      const matches = style.match(colorRegex) || [];
      matches.forEach((color) => colors.add(color));
    });

    // Get main layout structure
    const layoutInfo: LayoutInfo = {
      hasHeader: $("header").length > 0,
      hasFooter: $("footer").length > 0,
      hasNavigation: $("nav").length > 0,
      hasSidebar: $(".sidebar, aside, [class*='sidebar']").length > 0,
    };

    // Extract important UI components
    const uiComponents: UIComponents = {
      buttons: $("button, .btn, [class*='button']").length,
      forms: $("form").length,
      images: $("img").length,
      videos: $("video, iframe[src*='youtube'], iframe[src*='vimeo']").length,
      carousels: $(
        "[class*='carousel'], [class*='slider'], [class*='slideshow']"
      ).length,
    };

    // Combine all the data
    const siteAnalysis: SiteAnalysis = {
      url,
      bodyText: bodyText.substring(0, 3000), // Limit text content
      styleInfo: {
        inlineStyles: stylesData.slice(0, 10), // Limit to first 10 examples
        stylesheetUrls: stylesheetUrls.slice(0, 5), // Limit to first 5 stylesheets
        colorPalette: Array.from(colors).slice(0, 20), // Limit to 20 colors
      },
      layout: layoutInfo,
      uiComponents,
    };

    const prompt = `
You are a world-class UX consultant providing detailed analysis of Shopify storefronts. 
Analyze the provided data about this Shopify store and generate a comprehensive report in a structured JSON format.

You need to:
1. Assess how well the site follows UX best practices
2. Evaluate visual design, layout and usability
3. Identify strengths and areas for improvement
4. Assign specific scores on a scale of 1-10 for different aspects of the site
5. Provide clear, actionable recommendations

You MUST return ONLY valid, properly formatted JSON with no code fences or other formatting. Your response must be valid JSON that can be directly parsed using JSON.parse() with this exact format:

{
  "overallScore": <number between 1-10 with one decimal point>,
  "summary": "<brief executive summary of the analysis - about 150 words>",
  "categoryScores": {
    "userExperience": <score from 1-10>,
    "visualDesign": <score from 1-10>,
    "performance": <score from 1-10>,
    "accessibility": <score from 1-10>,
    "conversion": <score from 1-10>
  },
  "strengths": [
    {
      "title": "<strength title>",
      "description": "<brief description>"
    },
    // 3-5 more strengths
  ],
  "improvements": [
    {
      "title": "<improvement area title>",
      "description": "<brief description>",
      "priority": "<high|medium|low>"
    },
    // 3-5 more areas for improvement
  ],
  "detailedAnalysis": {
    "homepageEffectiveness": "<analysis of homepage>",
    "brandClarity": "<analysis of brand messaging>",
    "usabilityIssues": "<potential friction points>",
    "mobileExperience": "<assessment of mobile-friendliness>",
    "checkoutProcess": "<analysis of checkout if detectable>",
    "colorScheme": "<analysis of color palette and visual hierarchy>"
  },
  "actionableRecommendations": [
    "<specific recommendation 1>",
    "<specific recommendation 2>",
    // 3-5 more recommendations
  ]
}

This format is critical as it will be used to generate visualizations in a dashboard.
Ensure all textual fields are rich in detail but concise, and score values are realistic and nuanced.

Site Analysis Data:
${JSON.stringify(siteAnalysis, null, 2)}
`;

    // Initialize the Google GenAI SDK
    const genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY as string,
    });

    // Generate content using the model
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    let responseText = response.text || "No response from Gemini.";

    try {
      // Extract JSON from the response text if it's wrapped in markdown code blocks
      if (responseText.includes("```json") || responseText.includes("```")) {
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          responseText = jsonMatch[1].trim();
        }
      }

      // Try to parse the response as JSON
      const analysisResult: AnalysisResult = JSON.parse(responseText);

      // Ensure there's a rawFeedback field with the original text
      if (!analysisResult.rawFeedback) {
        analysisResult.rawFeedback = responseText;
      }

      return new Response(JSON.stringify(analysisResult), { status: 200 });
    } catch (error) {
      // If parsing fails, create a fallback response
      console.error("Failed to parse Gemini response as JSON:", error);

      const analysisResult: AnalysisResult = {
        overallScore: 7.0,
        summary: responseText.substring(0, 300) + "...",
        categoryScores: {
          userExperience: 7,
          visualDesign: 7,
          performance: 7,
          accessibility: 7,
          conversion: 7,
        },
        strengths: [
          {
            title: "Analysis Available",
            description:
              "The full analysis is available as unstructured text. Please check the detailed feedback.",
          },
        ],
        improvements: [
          {
            title: "Parsing Error",
            description:
              "The structured data couldn't be parsed correctly. The raw analysis is still available.",
            priority: "medium",
          },
        ],
        detailedAnalysis: {
          homepageEffectiveness: "See full analysis",
          brandClarity: "See full analysis",
          usabilityIssues: "See full analysis",
          mobileExperience: "See full analysis",
          checkoutProcess: "See full analysis",
          colorScheme: "See full analysis",
        },
        actionableRecommendations: ["See full analysis"],
        rawFeedback: responseText,
      };

      return new Response(JSON.stringify(analysisResult), { status: 200 });
    }
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch or analyze store.",
        details: err instanceof Error ? err.message : String(err),
      }),
      { status: 500 }
    );
  }
}
