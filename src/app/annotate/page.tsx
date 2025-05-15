"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import AnnotatedScreenshot from "@/components/AnnotatedScreenshot";
import ExportAnnotated from "@/components/ExportAnnotated";
import AnnotationHelper from "@/components/AnnotationHelper";

interface Annotation {
  id: string;
  x: number;
  y: number;
  text: string;
  type: "error" | "warning" | "suggestion";
}

export default function AnnotatePage() {
  const [url, setUrl] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const takeScreenshot = async () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setAnnotations([]); // Clear previous annotations

      // Add https if not present
      let targetUrl = url;
      if (
        !targetUrl.startsWith("http://") &&
        !targetUrl.startsWith("https://")
      ) {
        targetUrl = `https://${targetUrl}`;
      }

      const response = await fetch("/api/screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to take screenshot");
      }

      // Convert the blob to base64 data URL
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        setScreenshotUrl(base64Data);
        setIsLoading(false);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      setError((err as Error).message || "Failed to take screenshot");
      setIsLoading(false);
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

      const response = await fetch("/api/analyze-screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: screenshotUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze screenshot");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.annotations && Array.isArray(data.annotations)) {
        // Add new AI annotations to existing annotations
        setAnnotations((prevAnnotations) => [
          ...prevAnnotations,
          ...data.annotations,
        ]);
      } else {
        throw new Error("Invalid response format from analysis");
      }
    } catch (err) {
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

        <motion.div
          className="mb-8 bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow-md border border-[#dfe3e8] dark:border-gray-800"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-[#6b7177]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL (e.g., example.com)"
                className="w-full pl-10 pr-4 py-3 border border-[#dfe3e8] dark:border-gray-700 rounded-lg focus:ring-[#008060] focus:border-[#008060] bg-white dark:bg-[#212326] text-[#212326] dark:text-white transition-all duration-200"
              />
            </div>
            <motion.button
              onClick={takeScreenshot}
              disabled={isLoading}
              className="px-6 py-3 text-white rounded-lg button-3d bg-[#008060] hover:bg-[#006e52] disabled:bg-gray-400 disabled:transform-none disabled:box-shadow-none transition-all duration-200 flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {isLoading ? (
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
                  Capturing...
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
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Take Screenshot
                </>
              )}
            </motion.button>
          </div>

          {error && (
            <motion.div
              className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-[#2c1a1a] dark:text-red-400"
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

        {screenshotUrl ? (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="lg:col-span-2 bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow-md border border-[#dfe3e8] dark:border-gray-800"
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

              <div className="relative rounded-lg overflow-hidden border border-[#dfe3e8] dark:border-gray-700 shadow-inner bg-[#f6f6f7] dark:bg-[#212326]">
                <AnnotatedScreenshot
                  imageUrl={screenshotUrl}
                  annotations={annotations}
                  width={800}
                  height={600}
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
              className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow-md border border-[#dfe3e8] dark:border-gray-800 h-fit"
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
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
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
        ) : (
          <motion.div
            className="text-center py-12 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-md border border-[#dfe3e8] dark:border-gray-800"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-center items-center mb-6">
              <div className="w-20 h-20 bg-[#f6f6f7] dark:bg-[#212326] rounded-full flex items-center justify-center animate-pulse">
                <svg
                  className="h-10 w-10 text-[#008060]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-[#212326] dark:text-white mb-3">
              Ready to Capture
            </h2>
            <p className="text-[#6b7177] dark:text-gray-400 max-w-lg mx-auto">
              Enter a website URL above and click &quot;Take Screenshot&quot; to
              begin annotating and analyzing the page.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
