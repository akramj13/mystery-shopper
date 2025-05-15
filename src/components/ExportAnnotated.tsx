"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

interface ExportAnnotatedProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  filename?: string;
  className?: string;
}

export default function ExportAnnotated({
  canvasRef,
  filename = "annotated-screenshot.png",
  className = "",
}: ExportAnnotatedProps) {
  const isExporting = useRef(false);

  const handleExport = async () => {
    if (!canvasRef.current || isExporting.current) return;

    try {
      isExporting.current = true;

      // Get canvas data directly
      const canvas = canvasRef.current;
      const image = canvas.toDataURL("image/png");

      // Create download link
      const link = document.createElement("a");
      link.download = filename;
      link.href = image;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      isExporting.current = false;
    }
  };

  return (
    <motion.button
      onClick={handleExport}
      className={`flex items-center ${className}`}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <svg
        className="mr-2 h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      Export Image
    </motion.button>
  );
}
