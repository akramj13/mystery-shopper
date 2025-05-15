"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import AnnotatedScreenshot from "@/components/AnnotatedScreenshot";
import ExportAnnotated from "@/components/ExportAnnotated";
import AnnotationHelper from "@/components/AnnotationHelper";
import { useRouter } from "next/navigation";

interface Annotation {
  id: string;
  x: number;
  y: number;
  text: string;
  type: "error" | "warning" | "suggestion";
}

export default function AnnotatePage() {
  const [url] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debug Effect to monitor state changes
  useEffect(() => {
    console.log(
      "State changed - isLoading:",
      isLoading,
      "screenshotUrl:",
      screenshotUrl ? "present" : "null"
    );
  }, [isLoading, screenshotUrl]);

  // Effect to ensure loading state is reset if it gets stuck
  useEffect(() => {
    let loadingTimeout: NodeJS.Timeout;

    if (isLoading) {
      // If loading takes more than 10 seconds, we consider it stuck
      loadingTimeout = setTimeout(() => {
        console.warn("Loading timeout triggered - resetting loading state");
        setIsLoading(false);
        setError("Loading timed out. Please try again.");
      }, 10000);
    }

    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [isLoading]);

  const handleImageUpload = async (file: File) => {
    if (!file) {
      setError("No file selected");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setAnnotations([]); // Clear previous annotations
      setScreenshotUrl(null); // Reset previous screenshot

      console.log("Starting image upload for file:", file.name);

      // Validate file size
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        throw new Error("File too large. Please select an image under 10MB.");
      }

      // Create FormData
      const formData = new FormData();
      formData.append("image", file);

      // Function to handle the API request with a retry
      const uploadWithRetry = async (
        retryCount = 0
      ): Promise<{ imageBase64?: string; error?: string }> => {
        try {
          console.log(
            `Sending request to /api/screenshot (attempt ${retryCount + 1})`
          );
          const response = await fetch("/api/screenshot", {
            method: "POST",
            body: formData,
          });

          console.log(
            "Response received:",
            response.status,
            response.statusText
          );

          if (!response.ok) {
            throw new Error(
              `Failed to upload image: ${response.status} ${response.statusText}`
            );
          }

          console.log("Parsing response JSON");
          return await response.json();
        } catch (error) {
          if (retryCount < 2) {
            // Allow 3 attempts total
            console.log(`Retry attempt ${retryCount + 1} after error:`, error);
            return uploadWithRetry(retryCount + 1);
          }
          throw error;
        }
      };

      // Get the JSON response with base64 data
      const data = await uploadWithRetry();
      console.log("Response data received:", Object.keys(data).join(", "));

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.imageBase64) {
        throw new Error("No image data received");
      }

      // Validate the received base64 data
      if (!data.imageBase64.startsWith("data:image/")) {
        throw new Error("Invalid image data format received");
      }

      // Preload the image to ensure it's valid
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          console.log("Image successfully loaded");
          resolve(true);
        };
        img.onerror = () => {
          reject(new Error("Failed to load the image"));
        };
        if (!data.imageBase64) {
          reject(new Error("No image data received"));
          return;
        }
        img.src = data.imageBase64;
      });

      console.log("Setting screenshot URL with base64 data");
      setScreenshotUrl(data.imageBase64);
    } catch (err) {
      console.error("Image upload error:", err);
      setError((err as Error).message || "Failed to upload image");
    } finally {
      console.log("Setting isLoading to false");
      setIsLoading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const takeScreenshot = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length) {
      const file = files[0];
      // Check if it's an image
      if (file.type.startsWith("image/")) {
        handleImageUpload(file);
      } else {
        setError("Please upload an image file");
      }
    }
  };

  const analyzeScreenshot = async () => {
    if (!screenshotUrl) {
      setError("No screenshot to analyze");
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);

      // Get the dimensions from the AnnotatedScreenshot component
      const imageWidth = 1200; // Match the width we set for AnnotatedScreenshot
      const imageHeight = 900; // Match the height we set for AnnotatedScreenshot

      console.log(
        `Analyzing screenshot with dimensions: ${imageWidth}x${imageHeight}`
      );

      console.log("Sending request to analyze-screenshot API");
      const response = await fetch("/api/analyze-screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: screenshotUrl,
          width: imageWidth,
          height: imageHeight,
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API error details:", errorData);
        throw new Error(
          `Failed to analyze screenshot: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Response data keys:", Object.keys(data));

      if (data.error) {
        console.error("API returned error:", data.error, data.details || "");
        throw new Error(data.error);
      }

      if (data.annotations && Array.isArray(data.annotations)) {
        console.log(`Received ${data.annotations.length} annotations from API`);
        // Add new AI annotations to existing annotations
        setAnnotations((prevAnnotations) => [
          ...prevAnnotations,
          ...data.annotations,
        ]);
      } else {
        console.error("Invalid response format:", data);
        throw new Error("Invalid response format from analysis");
      }
    } catch (err) {
      console.error("Screenshot analysis error:", err);
      setError((err as Error).message || "Failed to analyze screenshot");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddAnnotation = useCallback((annotation: Annotation) => {
    setAnnotations((prev) => [...prev, annotation]);
  }, []);

  const handleUpdateAnnotation = useCallback(
    (id: string, updates: Partial<Annotation>) => {
      setAnnotations((prev) =>
        prev.map((anno) => (anno.id === id ? { ...anno, ...updates } : anno))
      );
    },
    []
  );

  const handleDeleteAnnotation = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((anno) => anno.id !== id));
  }, []);

  const handleAnnotationTextChange = (id: string, text: string) => {
    handleUpdateAnnotation(id, { text });
  };

  const handleAnnotationTypeChange = (
    id: string,
    type: "error" | "warning" | "suggestion"
  ) => {
    handleUpdateAnnotation(id, { type });
  };

  const handleSelectTemplate = useCallback(
    ({
      text,
      type,
    }: {
      text: string;
      type: "error" | "warning" | "suggestion";
    }) => {
      // If no annotations exist yet, show a message to click on the image
      if (annotations.length === 0) {
        setError("Click on the image to place this annotation");
        setTimeout(() => setError(null), 3000);
        return;
      }

      // Apply the template to the most recently added annotation
      const latestAnnotationId = annotations[annotations.length - 1].id;
      handleUpdateAnnotation(latestAnnotationId, { text, type });
    },
    [annotations, handleUpdateAnnotation]
  );

  const clearAnnotations = () => {
    setAnnotations([]);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#f6f6f7] dark:from-[#212326] dark:to-[#1a1a1a] pb-12">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 blob-1 bg-[#d1e8e0] dark:bg-[#004c3f]/20 blur-3xl opacity-60"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 blob-2 bg-[#b3bcf5] dark:bg-[#444b77]/20 blur-3xl opacity-40"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 blob-3 bg-[#b7ecec] dark:bg-[#216e6c]/20 blur-3xl opacity-30"></div>
      </div>

      <motion.div
        className="container mx-auto px-4 sm:px-6 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="max-w-6xl mx-auto pt-12 pb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <a
              onClick={() => router.push("/")}
              className="flex items-center text-[#008060] dark:text-[#00a47c] cursor-pointer hover:underline transition-all group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to home
            </a>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-[#212326] dark:text-white flex items-center">
            <svg
              className="w-8 h-8 mr-3 text-[#008060]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            Visual Feedback Tool
          </h1>
          <p className="text-[#6b7177] dark:text-gray-400 mb-8 max-w-2xl">
            Capture, annotate, and analyze screenshots of any webpage. Add
            notes, highlight issues, and export your feedback with a
            professional look.
          </p>
        </motion.div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          className="hidden"
          accept="image/*"
        />

        {!screenshotUrl ? (
          <motion.div
            className="mb-8"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div
              ref={dropAreaRef}
              className={`w-full h-80 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-[#008060] bg-[#f1f8f6] dark:bg-[#0a2922]"
                  : "border-[#dfe3e8] dark:border-gray-700 bg-white dark:bg-[#1a1a1a]"
              }`}
              onClick={takeScreenshot}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <svg
                className={`w-16 h-16 mb-4 transition-all duration-200 ${
                  isDragging
                    ? "text-[#008060]"
                    : "text-[#6b7177] dark:text-gray-400"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-lg font-medium text-[#212326] dark:text-white mb-2">
                Drag & drop your screenshot here
              </p>
              <p className="text-sm text-[#6b7177] dark:text-gray-400 mb-4">
                or click to browse your files
              </p>
              <button
                className="px-4 py-2 bg-[#008060] hover:bg-[#006e52] text-white rounded-lg shadow-sm flex items-center transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  takeScreenshot();
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg
                      className="mr-2 h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Select Image
                  </>
                )}
              </button>
            </div>

            {error && (
              <motion.div
                className="flex items-center p-4 mt-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-[#2c1a1a] dark:text-red-400"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  className="flex-shrink-0 inline w-5 h-5 mr-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                {error}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow-md border border-[#dfe3e8] dark:border-gray-800"
              variants={itemVariants}
            >
              <div className="mb-4 pb-4 border-b border-[#dfe3e8] dark:border-gray-700">
                <h2 className="text-xl font-semibold text-[#212326] dark:text-white mb-2">
                  Screenshot Preview
                </h2>
                <p className="text-sm text-[#6b7177] dark:text-gray-400">
                  Click on the image to add annotations
                </p>
              </div>

              <div className="relative rounded-lg overflow-hidden border border-[#dfe3e8] dark:border-gray-700 shadow-inner bg-[#f6f6f7] dark:bg-[#212326] max-w-full mx-auto">
                <AnnotatedScreenshot
                  imageUrl={screenshotUrl}
                  annotations={annotations}
                  width={1200}
                  height={900}
                  onAnnotationAdd={handleAddAnnotation}
                  onAnnotationUpdate={handleUpdateAnnotation}
                  onAnnotationDelete={handleDeleteAnnotation}
                  editable={true}
                  ref={canvasRef}
                />
              </div>

              <div className="mt-6 flex flex-wrap justify-between items-center gap-3">
                <div className="text-sm text-[#6b7177] dark:text-gray-400 flex items-center">
                  <svg
                    className="mr-2 h-5 w-5 text-[#008060]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {annotations.length} annotation
                  {annotations.length !== 1 ? "s" : ""}
                </div>
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    onClick={analyzeScreenshot}
                    disabled={isAnalyzing || !screenshotUrl}
                    className="px-4 py-2 bg-[#5c6ac4] hover:bg-[#4959b3] text-white rounded-lg shadow-sm hover:shadow disabled:bg-gray-400 disabled:shadow-none flex items-center"
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {isAnalyzing ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Analyzing...
                      </>
                    ) : (
                      <>
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
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                        AI Analyze
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    onClick={clearAnnotations}
                    disabled={annotations.length === 0}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm hover:shadow disabled:bg-gray-400 disabled:shadow-none flex items-center"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Clear All
                  </motion.button>
                  <ExportAnnotated
                    canvasRef={canvasRef}
                    filename={`annotated-${url.replace(
                      /[^a-zA-Z0-9]/g,
                      "-"
                    )}.png`}
                    className="px-4 py-2 bg-[#008060] hover:bg-[#006e52] text-white rounded-lg shadow-sm hover:shadow flex items-center"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow-md border border-[#dfe3e8] dark:border-gray-800"
              variants={itemVariants}
            >
              <div className="mb-4 pb-4 border-b border-[#dfe3e8] dark:border-gray-700">
                <h2 className="text-xl font-semibold text-[#212326] dark:text-white flex items-center mb-2">
                  <svg
                    className="mr-2 h-5 w-5 text-[#008060]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Annotations
                </h2>
                <p className="text-sm text-[#6b7177] dark:text-gray-400">
                  Manage your feedback notes
                </p>
              </div>

              {annotations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-[#f6f6f7] dark:bg-[#212326] rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="h-8 w-8 text-[#6b7177] dark:text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-[#6b7177] dark:text-gray-400 mb-2">
                    No annotations yet
                  </p>
                  <p className="text-sm text-[#6b7177] dark:text-gray-400">
                    Click on the image to add one or use the &quot;AI
                    Analyze&quot; button for automatic suggestions.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {annotations.map((anno, index) => (
                    <motion.div
                      key={anno.id}
                      className="border border-[#dfe3e8] dark:border-gray-700 rounded-lg p-4 bg-[#f6f6f7] dark:bg-[#212326] hover:shadow-md transition-all duration-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                    >
                      <div className="flex justify-between mb-3">
                        <select
                          value={anno.type}
                          onChange={(e) =>
                            handleAnnotationTypeChange(
                              anno.id,
                              e.target.value as
                                | "error"
                                | "warning"
                                | "suggestion"
                            )
                          }
                          className="px-3 py-1 text-sm rounded border border-[#dfe3e8] dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-[#212326] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#008060]"
                        >
                          <option value="error">Error</option>
                          <option value="warning">Warning</option>
                          <option value="suggestion">Suggestion</option>
                        </select>
                        <button
                          onClick={() => handleDeleteAnnotation(anno.id)}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <textarea
                        value={anno.text}
                        onChange={(e) =>
                          handleAnnotationTextChange(anno.id, e.target.value)
                        }
                        className="w-full p-3 min-h-[100px] text-sm rounded border border-[#dfe3e8] dark:border-gray-700 bg-white dark:bg-[#212326] text-[#212326] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#008060]"
                      />
                      <div className="mt-2 text-sm text-[#6b7177] dark:text-gray-400">
                        Position: ({Math.round(anno.x)}, {Math.round(anno.y)})
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <AnnotationHelper onSelectTemplate={handleSelectTemplate} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
