import * as cheerio from "cheerio";
import { GoogleGenAI } from "@google/genai";
import {
  StyleData,
  LayoutInfo,
  UIComponents,
  SiteAnalysis,
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
You are a world-class UX consultant. Analyze the following Shopify storefront and provide UX feedback:
1. How effective is the homepage?
2. Is the brand message clear?
3. What would confuse or frustrate a new visitor?
4. Suggestions for improvement?
5. Analyze the color scheme and visual hierarchy
6. Comment on the layout and use of space
7. Evaluate the mobile-friendliness based on CSS breakpoints and responsive design

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

    const feedback = response.text || "No response from Gemini.";

    return new Response(JSON.stringify({ feedback }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch or analyze store." }),
      { status: 500 }
    );
  }
}
