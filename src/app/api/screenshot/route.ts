import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("Screenshot API: Request received");

  try {
    const formData = await req.formData();
    console.log("Screenshot API: FormData parsed");

    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      console.log("Screenshot API: No image file provided");
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    console.log(
      `Screenshot API: File received - ${imageFile.name}, size: ${imageFile.size}, type: ${imageFile.type}`
    );

    try {
      // Get the file bytes
      console.log("Screenshot API: Reading file data");
      const bytes = await imageFile.arrayBuffer();
      console.log(
        `Screenshot API: File data read, size: ${bytes.byteLength} bytes`
      );

      // Create a safe file name without special characters
      const fileName = imageFile.name
        ? imageFile.name.replace(/[^\w\s.-]/gi, "")
        : "screenshot.png";

      // Convert bytes to base64 string
      console.log("Screenshot API: Converting to base64");
      const base64Prefix = `data:${imageFile.type || "image/png"};base64,`;
      const base64Data = Buffer.from(bytes).toString("base64");
      const base64String = base64Prefix + base64Data;
      console.log(
        `Screenshot API: Converted to base64, length: ${base64String.length}`
      );

      // Construct the response
      const response = {
        success: true,
        imageBase64: base64String,
        fileName: fileName,
        type: imageFile.type || "image/png",
      };

      console.log("Screenshot API: Sending successful response");
      return NextResponse.json(response);
    } catch (error) {
      console.error("Screenshot API: Error processing image data:", error);
      return NextResponse.json(
        {
          error:
            "Failed to process image: " +
            (error instanceof Error ? error.message : String(error)),
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Screenshot API: Image upload error:", err);
    return NextResponse.json(
      {
        error:
          "Image upload failed: " +
          (err instanceof Error ? err.message : String(err)),
      },
      { status: 500 }
    );
  }
}
