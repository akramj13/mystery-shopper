"use client";

import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  ForwardedRef,
  useCallback,
} from "react";

interface Annotation {
  id: string;
  x: number;
  y: number;
  text: string;
  type: "error" | "warning" | "suggestion";
}

interface AnnotatedScreenshotProps {
  imageUrl: string;
  annotations: Annotation[];
  width?: number;
  height?: number;
  onAnnotationAdd?: (annotation: Annotation) => void;
  onAnnotationUpdate?: (id: string, updates: Partial<Annotation>) => void;
  onAnnotationDelete?: (id: string) => void;
  editable?: boolean;
}

const AnnotatedScreenshot = forwardRef(
  (
    {
      imageUrl,
      annotations = [],
      width = 800,
      height = 600,
      onAnnotationAdd,
      editable = false,
    }: AnnotatedScreenshotProps,
    ref: ForwardedRef<HTMLCanvasElement>
  ) => {
    const [stageSize, setStageSize] = useState({ width, height });
    const containerRef = useRef<HTMLDivElement>(null);
    const internalCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    // Get the actual canvas ref (either from props or internal)
    const canvasRef =
      (ref as React.RefObject<HTMLCanvasElement>) || internalCanvasRef;

    // Calculate the required height for text
    const calculateTextHeight = (
      ctx: CanvasRenderingContext2D,
      text: string,
      maxWidth: number
    ): number => {
      const words = text.split(" ");
      let line = "";
      let lineCount = 1;

      for (const word of words) {
        const testLine = line + word + " ";
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth) {
          line = word + " ";
          lineCount++;
        } else {
          line = testLine;
        }
      }

      return lineCount;
    };

    // Draw annotations on canvas with enhanced visibility
    const drawAnnotations = useCallback(
      (ctx: CanvasRenderingContext2D) => {
        annotations.forEach((anno) => {
          // Use more vibrant colors with better contrast
          const color =
            anno.type === "error"
              ? "#FF2D2D"
              : anno.type === "warning"
              ? "#FF9500"
              : "#2D7FFF";

          const bgColor =
            anno.type === "error"
              ? "rgba(255, 45, 45, 0.15)"
              : anno.type === "warning"
              ? "rgba(255, 149, 0, 0.15)"
              : "rgba(45, 127, 255, 0.15)";

          const textColor =
            anno.type === "error"
              ? "#9C0000"
              : anno.type === "warning"
              ? "#985700"
              : "#00409C";

          const icon =
            anno.type === "error"
              ? "❗"
              : anno.type === "warning"
              ? "⚠️"
              : "🔼";

          // Set font for text measurement
          ctx.font = "14px Arial";

          // Calculate dimensions
          const maxTextWidth = 150;
          const headerHeight = 24;
          const padding = 12;
          const cornerRadius = 8;

          // Calculate text height
          const lineHeight = 18;
          const lineCount = calculateTextHeight(
            ctx,
            anno.text,
            maxTextWidth - padding * 2
          );
          const textHeight = lineCount * lineHeight;

          // Calculate box dimensions
          const textBoxWidth = maxTextWidth;
          const textBoxHeight = headerHeight + textHeight + padding * 2;

          // Position box
          const textBoxX = anno.x - 160;
          const textBoxY = anno.y - 100;

          // Ensure box is within canvas boundaries
          const adjustedX = Math.max(
            10,
            Math.min(textBoxX, stageSize.width - textBoxWidth - 10)
          );
          const adjustedY = Math.max(
            10,
            Math.min(textBoxY, stageSize.height - textBoxHeight - 10)
          );

          // Draw connecting line with increased thickness
          ctx.beginPath();
          ctx.moveTo(anno.x, anno.y);
          ctx.lineTo(adjustedX + textBoxWidth / 2, adjustedY + textBoxHeight);
          ctx.strokeStyle = color;
          ctx.lineWidth = 3;
          ctx.stroke();

          // Draw circle at the point with increased size and opacity
          ctx.beginPath();
          ctx.arc(anno.x, anno.y, 12, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.9;
          ctx.fill();
          ctx.globalAlpha = 1.0;

          // Draw white border around circle
          ctx.strokeStyle = "white";
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw text container with rounded corners
          ctx.beginPath();
          ctx.moveTo(adjustedX + cornerRadius, adjustedY);
          ctx.lineTo(adjustedX + textBoxWidth - cornerRadius, adjustedY);
          ctx.quadraticCurveTo(
            adjustedX + textBoxWidth,
            adjustedY,
            adjustedX + textBoxWidth,
            adjustedY + cornerRadius
          );
          ctx.lineTo(
            adjustedX + textBoxWidth,
            adjustedY + textBoxHeight - cornerRadius
          );
          ctx.quadraticCurveTo(
            adjustedX + textBoxWidth,
            adjustedY + textBoxHeight,
            adjustedX + textBoxWidth - cornerRadius,
            adjustedY + textBoxHeight
          );
          ctx.lineTo(adjustedX + cornerRadius, adjustedY + textBoxHeight);
          ctx.quadraticCurveTo(
            adjustedX,
            adjustedY + textBoxHeight,
            adjustedX,
            adjustedY + textBoxHeight - cornerRadius
          );
          ctx.lineTo(adjustedX, adjustedY + cornerRadius);
          ctx.quadraticCurveTo(
            adjustedX,
            adjustedY,
            adjustedX + cornerRadius,
            adjustedY
          );
          ctx.closePath();

          // Draw box shadow
          ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
          ctx.shadowBlur = 8;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;

          // Fill text box with semi-transparent white background
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
          ctx.fill();

          // Reset shadow
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          // Draw border
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw a colored header band at the top of the box
          ctx.beginPath();
          ctx.moveTo(adjustedX + cornerRadius, adjustedY);
          ctx.lineTo(adjustedX + textBoxWidth - cornerRadius, adjustedY);
          ctx.quadraticCurveTo(
            adjustedX + textBoxWidth,
            adjustedY,
            adjustedX + textBoxWidth,
            adjustedY + cornerRadius
          );
          ctx.lineTo(adjustedX + textBoxWidth, adjustedY + headerHeight);
          ctx.lineTo(adjustedX, adjustedY + headerHeight);
          ctx.lineTo(adjustedX, adjustedY + cornerRadius);
          ctx.quadraticCurveTo(
            adjustedX,
            adjustedY,
            adjustedX + cornerRadius,
            adjustedY
          );
          ctx.closePath();
          ctx.fillStyle = bgColor;
          ctx.fill();

          // Draw icon and header text
          ctx.font = "bold 14px Arial";
          ctx.fillStyle = textColor;
          ctx.fillText(
            `${icon} ${anno.type.toUpperCase()}`,
            adjustedX + padding,
            adjustedY + 17
          );

          // Draw text with word wrapping
          ctx.font = "14px Arial";
          ctx.fillStyle = "#333333";
          const words = anno.text.split(" ");
          let line = "";
          let y = adjustedY + headerHeight + padding + 5;

          words.forEach((word) => {
            const testLine = line + word + " ";
            const metrics = ctx.measureText(testLine);
            if (metrics.width > textBoxWidth - padding * 2) {
              ctx.fillText(line, adjustedX + padding, y);
              line = word + " ";
              y += lineHeight;
            } else {
              line = testLine;
            }
          });

          ctx.fillText(line, adjustedX + padding, y);

          // Draw a small pointer triangle connecting the box to the target point
          const triangleX = adjustedX + textBoxWidth / 2;
          const triangleY = adjustedY + textBoxHeight;

          ctx.beginPath();
          ctx.moveTo(triangleX - 10, triangleY);
          ctx.lineTo(triangleX, triangleY + 10);
          ctx.lineTo(triangleX + 10, triangleY);
          ctx.closePath();
          ctx.fillStyle = "white";
          ctx.fill();
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      },
      [annotations, stageSize]
    );

    // Load the image and draw everything
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;

      img.onload = () => {
        // Adjust canvas size based on image dimensions
        const aspectRatio = img.width / img.height;
        let newWidth = width;
        let newHeight = height;

        if (width / height > aspectRatio) {
          newWidth = height * aspectRatio;
        } else {
          newHeight = width / aspectRatio;
        }

        setStageSize({ width: newWidth, height: newHeight });
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Draw image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Add a very slight darkening overlay to make annotations more visible
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw annotations
        drawAnnotations(ctx);

        setIsImageLoaded(true);
      };
    }, [imageUrl, width, height, annotations, canvasRef, drawAnnotations]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!editable || !onAnnotationAdd || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create new annotation
      const newAnnotation: Annotation = {
        id: `anno-${Date.now()}`,
        x,
        y,
        text: "New annotation",
        type: "suggestion",
      };

      onAnnotationAdd(newAnnotation);
    };

    return (
      <div
        ref={containerRef}
        className="relative border border-gray-300 rounded-lg shadow-lg"
        style={{ width: stageSize.width, height: stageSize.height }}
      >
        <canvas
          ref={canvasRef}
          width={stageSize.width}
          height={stageSize.height}
          onClick={handleCanvasClick}
          className="cursor-pointer rounded-lg"
        />

        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            Loading screenshot...
          </div>
        )}
      </div>
    );
  }
);

AnnotatedScreenshot.displayName = "AnnotatedScreenshot";

export default AnnotatedScreenshot;
