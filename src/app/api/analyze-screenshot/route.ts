import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Check if the API key is available
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not defined in environment variables");
}

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenAI({
  apiKey: apiKey as string,
});

// Define interface for Gemini API response annotations
interface GeminiAnnotation {
  text?: string;
  type?: string;
  position?: {
    x?: number;
    y?: number;
  };
}

export async function POST(req: Request) {
  try {
    // Check if API key is available
    if (!apiKey) {
      console.error("Cannot process request: GEMINI_API_KEY is not defined");
      return NextResponse.json(
        {
          error: "API configuration error",
          details: "API key is not configured",
        },
        { status: 500 }
      );
    }

    const { imageBase64, width, height } = await req.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: "No image data provided" },
        { status: 400 }
      );
    }

    // Validate image format
    if (!imageBase64.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Invalid image format. Must be base64 data URL" },
        { status: 400 }
      );
    }

    // Determine image dimensions from client-provided data or use defaults
    const imageDimensions = {
      width: width || 1200,
      height: height || 900,
    };

    console.log(
      `Using image dimensions: ${imageDimensions.width}x${imageDimensions.height}`
    );

    // Remove the "data:image/png;base64," prefix if present for Gemini API
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    // Call Gemini API with the image
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Analyze this website screenshot and identify 3-5 UX/UI issues.
The image dimensions are ${imageDimensions.width}x${imageDimensions.height} pixels. 

For each issue:
1. Describe the issue briefly (max 10 words)
2. Classify as "error" (serious problem), "warning" (moderate issue), or "suggestion" (improvement)
3. Provide approximate x,y coordinates (as percentage of image width/height) where the issue is located

Respond in this JSON format only:
[
  {
    "text": "Issue description",
    "type": "error|warning|suggestion",
    "position": { "x": 0.5, "y": 0.3 }
  }
]

Focus on these common UI/UX issues:
- Unclear call-to-action buttons
- Low contrast text
- Overwhelming amount of text
- Poor visual hierarchy
- Confusing navigation
- Mobile responsiveness issues
- Accessibility concerns
- Slow-loading elements
- Inconsistent design`,
            },
            {
              inlineData: {
                mimeType: "image/png",
                data: base64Data,
              },
            },
          ],
        },
      ],
    });

    // Get response text
    const responseText = response.text || "No response from Gemini.";

    // Parse the JSON response
    try {
      // Extract JSON from the response if surrounded by markdown code blocks
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
        responseText.match(/```\s*([\s\S]*?)\s*```/) || [null, responseText];

      const jsonText = jsonMatch[1] || responseText;
      const annotations = JSON.parse(jsonText);

      // Validate and transform the annotations
      const transformedAnnotations = annotations.map(
        (anno: GeminiAnnotation, index: number) => ({
          id: `ai-anno-${Date.now()}-${index}`,
          text: anno.text || "UI/UX issue detected",
          type: ["error", "warning", "suggestion"].includes(anno.type as string)
            ? anno.type
            : "suggestion",
          x:
            Math.round((anno.position?.x || 0.5) * imageDimensions.width) ||
            Math.round(imageDimensions.width / 2),
          y:
            Math.round((anno.position?.y || 0.5) * imageDimensions.height) ||
            Math.round(imageDimensions.height / 2),
        })
      );

      return NextResponse.json({ annotations: transformedAnnotations });
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError);
      return NextResponse.json(
        {
          error: "Failed to parse AI response",
          rawResponse: responseText,
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Screenshot analysis error:", err);
    // Add more detailed error information
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorStack = err instanceof Error ? err.stack : undefined;
    return NextResponse.json(
      {
        error: "Failed to analyze screenshot",
        details: errorMessage,
        stack: errorStack,
      },
      { status: 500 }
    );
  }
}
