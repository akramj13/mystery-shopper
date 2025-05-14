"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AnalysisResult } from "@/types/critique";

export default function Result() {
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch analysis data from localStorage
    const fetchData = () => {
      try {
        const savedUrl = localStorage.getItem("analyzedUrl");
        const savedData = localStorage.getItem("analysisResult");

        if (savedData) {
          setAnalysisData(JSON.parse(savedData));
          setLoading(false);
        } else {
          // If no data in localStorage, show error after loading animation
          setTimeout(() => {
            setError(
              "No analysis data found. Please return to the homepage and analyze a store."
            );
            setLoading(false);
          }, 1500);
        }
      } catch (error) {
        console.error("Error fetching analysis data:", error);
        setError("Error loading analysis data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-[#d82c0d]";
      case "medium":
        return "text-[#f49342]";
      case "low":
        return "text-[#8a8a8a]";
      default:
        return "text-[#6b7177]";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-[#008060]";
    if (score >= 6) return "bg-[#95bf47]";
    if (score >= 4) return "bg-[#f49342]";
    return "bg-[#d82c0d]";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Good";
    if (score >= 4) return "Fair";
    return "Needs Improvement";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-[#f6f6f7] dark:from-[#212326] dark:to-[#1a1a1a]">
      {/* Navigation - Shopify Style */}
      <header className="w-full bg-white/90 dark:bg-[#212326]/90 backdrop-blur-sm border-b border-[#dfe3e8] dark:border-gray-800 sticky top-0 z-50">
        <div className="shopify-container flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-8 text-[#212326] dark:text-white flex items-center">
              <svg
                className="w-8 h-8 mr-2 text-[#008060]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm1-9.92V9h4c-.58-2.5-2.91-4-5.5-4S5.58 6.5 5 9h4v-.92c-1.15.33-2 1.39-2 2.64v1.56c0 1.52 1.23 2.75 2.75 2.75s2.75-1.23 2.75-2.75v-1.56c0-1.25-.85-2.31-2-2.64z" />
              </svg>
              Mystery Shopper
            </h1>
            <nav className="hidden md:flex space-x-6">
              <a
                href="#features"
                className="text-[#6b7177] hover:text-[#008060] dark:text-gray-300 dark:hover:text-[#00a47c] text-base font-medium transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-[#6b7177] hover:text-[#008060] dark:text-gray-300 dark:hover:text-[#00a47c] text-base font-medium transition-colors"
              >
                How it works
              </a>
              <a
                href="#pricing"
                className="text-[#6b7177] hover:text-[#008060] dark:text-gray-300 dark:hover:text-[#00a47c] text-base font-medium transition-colors"
              >
                Pricing
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="text-[#212326] hover:text-[#008060] dark:text-white dark:hover:text-[#00a47c] text-base font-medium transition-colors"
            >
              Log in
            </a>
            <Button className="bg-[#008060] hover:bg-[#004c3f] text-white rounded-lg font-medium px-5 py-2.5 shadow-lg shadow-[#008060]/20 hover:shadow-[#008060]/30 transition-all duration-300">
              Start free
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Shopify Style */}
      <main className="flex-grow py-12 relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#d1e8e0] dark:bg-[#004c3f]/20 rounded-full blur-3xl opacity-40"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#d1e8e0] dark:bg-[#004c3f]/20 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="shopify-container relative z-10">
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-8">
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

            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#212326] dark:text-white">
              Store Analysis Results
            </h1>

            {loading ? (
              <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl p-12 mb-8 flex items-center justify-center border border-[#dfe3e8] dark:border-gray-800 min-h-[40vh] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#d1e8e0] dark:bg-[#004c3f]/20 rounded-full blur-3xl -mr-20 -mt-20 opacity-40"></div>
                <div className="flex flex-col items-center relative z-10">
                  <div className="w-20 h-20 mb-6 relative">
                    <svg
                      className="w-full h-full text-[#008060] animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
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
                  </div>
                  <p className="text-xl font-medium text-[#212326] dark:text-white mb-2">
                    Analyzing your store...
                  </p>
                  <p className="text-[#6b7177] dark:text-gray-400 text-center max-w-md">
                    We're thoroughly examining your Shopify store to provide you
                    with detailed insights and recommendations.
                  </p>
                </div>
              </div>
            ) : error ? (
              <motion.div
                className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl p-8 mb-8 border border-[#dfe3e8] dark:border-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#ffeceb] dark:bg-[#3e1c19] rounded-full flex items-center justify-center mr-4 text-[#d82c0d]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-[#212326] dark:text-white">
                    Error
                  </h2>
                </div>
                <p className="mb-6 text-[#6b7177] dark:text-gray-400">
                  {error}
                </p>
                <Button
                  onClick={() => router.push("/")}
                  className="bg-[#008060] hover:bg-[#004c3f] text-white rounded-lg shadow-lg shadow-[#008060]/20 hover:shadow-[#008060]/30 transition-all duration-300"
                >
                  Return to Homepage
                </Button>
              </motion.div>
            ) : analysisData ? (
              <>
                {/* Overview Section */}
                <motion.div
                  className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl p-8 mb-8 border border-[#dfe3e8] dark:border-gray-800 relative overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#d1e8e0] dark:bg-[#004c3f]/20 rounded-full blur-3xl -mr-20 -mt-20 opacity-40"></div>
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row mb-6 items-start">
                      <div className="w-full md:w-2/3 pr-0 md:pr-8 mb-6 md:mb-0">
                        <h2 className="text-2xl font-semibold mb-4 text-[#212326] dark:text-white flex items-center">
                          <svg
                            className="w-6 h-6 mr-2 text-[#008060]"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            />
                          </svg>
                          Analysis Summary
                        </h2>
                        <p className="text-[#6b7177] dark:text-gray-400 mb-6 text-lg leading-relaxed">
                          {analysisData.summary}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                          <div className="bg-gradient-to-br from-[#f6f6f7] to-white dark:from-[#212326] dark:to-[#2c2c2e] p-4 rounded-xl text-center border border-[#dfe3e8] dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="text-xl font-bold text-[#212326] dark:text-white mb-1">
                              {analysisData.categoryScores.userExperience}/10
                            </div>
                            <div className="text-xs text-[#6b7177] dark:text-gray-400 font-medium">
                              User Experience
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-[#f6f6f7] to-white dark:from-[#212326] dark:to-[#2c2c2e] p-4 rounded-xl text-center border border-[#dfe3e8] dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="text-xl font-bold text-[#212326] dark:text-white mb-1">
                              {analysisData.categoryScores.visualDesign}/10
                            </div>
                            <div className="text-xs text-[#6b7177] dark:text-gray-400 font-medium">
                              Visual Design
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-[#f6f6f7] to-white dark:from-[#212326] dark:to-[#2c2c2e] p-4 rounded-xl text-center border border-[#dfe3e8] dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="text-xl font-bold text-[#212326] dark:text-white mb-1">
                              {analysisData.categoryScores.performance}/10
                            </div>
                            <div className="text-xs text-[#6b7177] dark:text-gray-400 font-medium">
                              Performance
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-[#f6f6f7] to-white dark:from-[#212326] dark:to-[#2c2c2e] p-4 rounded-xl text-center border border-[#dfe3e8] dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="text-xl font-bold text-[#212326] dark:text-white mb-1">
                              {analysisData.categoryScores.accessibility}/10
                            </div>
                            <div className="text-xs text-[#6b7177] dark:text-gray-400 font-medium">
                              Accessibility
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-[#f6f6f7] to-white dark:from-[#212326] dark:to-[#2c2c2e] p-4 rounded-xl text-center border border-[#dfe3e8] dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="text-xl font-bold text-[#212326] dark:text-white mb-1">
                              {analysisData.categoryScores.conversion}/10
                            </div>
                            <div className="text-xs text-[#6b7177] dark:text-gray-400 font-medium">
                              Conversion
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-full md:w-1/3 bg-gradient-to-br from-[#f6f6f7] to-white dark:from-[#212326] dark:to-[#2c2c2e] rounded-2xl p-6 text-center border border-[#dfe3e8] dark:border-gray-800 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 text-[#212326] dark:text-white">
                          Overall Score
                        </h3>
                        <div className="relative w-40 h-40 mx-auto mb-4">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-5xl font-bold text-[#212326] dark:text-white">
                              {analysisData.overallScore}
                            </span>
                          </div>
                          <svg
                            className="w-full h-full transform -rotate-90"
                            viewBox="0 0 36 36"
                          >
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#E6E6E6"
                              strokeWidth="2.5"
                              strokeDasharray="100, 100"
                              strokeLinecap="round"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke={
                                analysisData.overallScore >= 8
                                  ? "#008060"
                                  : analysisData.overallScore >= 6
                                  ? "#95bf47"
                                  : analysisData.overallScore >= 4
                                  ? "#f49342"
                                  : "#d82c0d"
                              }
                              strokeWidth="2.5"
                              strokeDasharray={`${
                                analysisData.overallScore * 10
                              }, 100`}
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <p
                          className="text-lg font-medium"
                          style={{
                            color:
                              analysisData.overallScore >= 8
                                ? "#008060"
                                : analysisData.overallScore >= 6
                                ? "#95bf47"
                                : analysisData.overallScore >= 4
                                ? "#f49342"
                                : "#d82c0d",
                          }}
                        >
                          {getScoreLabel(analysisData.overallScore)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <motion.div
                    className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl p-8 border border-[#dfe3e8] dark:border-gray-800 relative overflow-hidden"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#d1e8e0] dark:bg-[#004c3f]/20 rounded-full blur-3xl -mr-20 -mt-20 opacity-30"></div>
                    <div className="relative z-10">
                      <h2 className="text-xl font-semibold mb-5 text-[#212326] dark:text-white flex items-center">
                        <div className="w-8 h-8 bg-[#d1e8e0] dark:bg-[#004c3f]/50 rounded-full flex items-center justify-center text-[#008060] dark:text-[#00a47c] mr-3">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        Strengths
                      </h2>
                      <ul className="space-y-4">
                        {analysisData.strengths.map((strength, index) => (
                          <li
                            key={index}
                            className="bg-gradient-to-br from-[#f6f6f7] to-white dark:from-[#212326] dark:to-[#2c2c2e] p-5 rounded-xl border border-[#dfe3e8] dark:border-gray-800 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
                          >
                            <h3 className="font-medium text-[#212326] dark:text-white mb-2 text-lg flex items-center">
                              <span className="w-6 h-6 rounded-full bg-[#008060]/10 text-[#008060] flex items-center justify-center mr-2 text-sm font-bold">
                                {index + 1}
                              </span>
                              {strength.title}
                            </h3>
                            <p className="text-sm text-[#6b7177] dark:text-gray-400 leading-relaxed">
                              {strength.description}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl p-8 border border-[#dfe3e8] dark:border-gray-800 relative overflow-hidden"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#ffeceb] dark:bg-[#3e1c19]/20 rounded-full blur-3xl -mr-20 -mt-20 opacity-30"></div>
                    <div className="relative z-10">
                      <h2 className="text-xl font-semibold mb-5 text-[#212326] dark:text-white flex items-center">
                        <div className="w-8 h-8 bg-[#ffeceb] dark:bg-[#3e1c19]/50 rounded-full flex items-center justify-center text-[#d82c0d] mr-3">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                        </div>
                        Areas to Improve
                      </h2>
                      <ul className="space-y-4">
                        {analysisData.improvements.map((improvement, index) => (
                          <li
                            key={index}
                            className="bg-gradient-to-br from-[#f6f6f7] to-white dark:from-[#212326] dark:to-[#2c2c2e] p-5 rounded-xl border border-[#dfe3e8] dark:border-gray-800 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-[#212326] dark:text-white text-lg flex items-center">
                                <span className="w-6 h-6 rounded-full bg-[#d82c0d]/10 text-[#d82c0d] flex items-center justify-center mr-2 text-sm font-bold">
                                  {index + 1}
                                </span>
                                {improvement.title}
                              </h3>
                              <span
                                className={`text-xs font-medium px-3 py-1 rounded-full ${
                                  improvement.priority === "high"
                                    ? "bg-[#ffeceb] text-[#d82c0d]"
                                    : improvement.priority === "medium"
                                    ? "bg-[#fff8f3] text-[#f49342]"
                                    : "bg-[#f6f6f7] text-[#8a8a8a]"
                                }`}
                              >
                                {improvement.priority} priority
                              </span>
                            </div>
                            <p className="text-sm text-[#6b7177] dark:text-gray-400 leading-relaxed">
                              {improvement.description}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </div>

                {/* Detailed Analysis */}
                <motion.div
                  className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl p-8 mb-8 border border-[#dfe3e8] dark:border-gray-800 relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#d1e8e0] dark:bg-[#004c3f]/20 rounded-full blur-3xl -mr-20 -mt-20 opacity-30"></div>
                  <div className="relative z-10">
                    <h2 className="text-xl font-semibold mb-6 text-[#212326] dark:text-white flex items-center">
                      <svg
                        className="w-6 h-6 mr-2 text-[#008060]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Detailed Analysis
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        className="bg-gradient-to-br from-[#f6f6f7] to-white dark:from-[#212326] dark:to-[#2c2c2e] p-6 rounded-xl border border-[#dfe3e8] dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]"
                        whileHover={{ scale: 1.01 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <h3 className="text-[#212326] dark:text-white font-medium mb-3 text-lg flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-[#008060]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                          Homepage Effectiveness
                        </h3>
                        <p className="text-sm text-[#6b7177] dark:text-gray-400 leading-relaxed">
                          {analysisData.detailedAnalysis.homepageEffectiveness}
                        </p>
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-br from-[#f6f6f7] to-white dark:from-[#212326] dark:to-[#2c2c2e] p-6 rounded-xl border border-[#dfe3e8] dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]"
                        whileHover={{ scale: 1.01 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <h3 className="text-[#212326] dark:text-white font-medium mb-3 text-lg flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-[#008060]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                          Brand Clarity
                        </h3>
                        <p className="text-sm text-[#6b7177] dark:text-gray-400 leading-relaxed">
                          {analysisData.detailedAnalysis.brandClarity}
                        </p>
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-br from-[#f6f6f7] to-white dark:from-[#212326] dark:to-[#2c2c2e] p-6 rounded-xl border border-[#dfe3e8] dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]"
                        whileHover={{ scale: 1.01 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <h3 className="text-[#212326] dark:text-white font-medium mb-3 text-lg flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-[#008060]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Usability Issues
                        </h3>
                        <p className="text-sm text-[#6b7177] dark:text-gray-400 leading-relaxed">
                          {analysisData.detailedAnalysis.usabilityIssues}
                        </p>
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-br from-[#f6f6f7] to-white dark:from-[#212326] dark:to-[#2c2c2e] p-6 rounded-xl border border-[#dfe3e8] dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]"
                        whileHover={{ scale: 1.01 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <h3 className="text-[#212326] dark:text-white font-medium mb-3 text-lg flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-[#008060]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                          Mobile Experience
                        </h3>
                        <p className="text-sm text-[#6b7177] dark:text-gray-400 leading-relaxed">
                          {analysisData.detailedAnalysis.mobileExperience}
                        </p>
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-br from-[#f6f6f7] to-white dark:from-[#212326] dark:to-[#2c2c2e] p-6 rounded-xl border border-[#dfe3e8] dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]"
                        whileHover={{ scale: 1.01 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <h3 className="text-[#212326] dark:text-white font-medium mb-3 text-lg flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-[#008060]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          Checkout Process
                        </h3>
                        <p className="text-sm text-[#6b7177] dark:text-gray-400 leading-relaxed">
                          {analysisData.detailedAnalysis.checkoutProcess}
                        </p>
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-br from-[#f6f6f7] to-white dark:from-[#212326] dark:to-[#2c2c2e] p-6 rounded-xl border border-[#dfe3e8] dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]"
                        whileHover={{ scale: 1.01 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <h3 className="text-[#212326] dark:text-white font-medium mb-3 text-lg flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-[#008060]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                            />
                          </svg>
                          Color Scheme
                        </h3>
                        <p className="text-sm text-[#6b7177] dark:text-gray-400 leading-relaxed">
                          {analysisData.detailedAnalysis.colorScheme}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Actionable Recommendations */}
                <motion.div
                  className="bg-gradient-to-r from-[#d1e8e0] to-[#e9f5f2] dark:from-[#004c3f]/20 dark:to-[#008060]/10 rounded-2xl p-8 mb-8 shadow-xl border border-[#008060]/20 dark:border-[#008060]/30 relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#008060]/10 rounded-full blur-3xl -mr-20 -mt-20 opacity-60"></div>
                  <div className="relative z-10">
                    <h2 className="text-xl font-semibold mb-6 text-[#212326] dark:text-white flex items-center">
                      <svg
                        className="w-6 h-6 mr-2 text-[#008060]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                      Actionable Recommendations
                    </h2>
                    <ul className="space-y-4">
                      {analysisData.actionableRecommendations.map(
                        (recommendation, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start bg-white/70 dark:bg-[#212326]/70 p-4 rounded-xl border border-[#008060]/10 dark:border-[#008060]/20 shadow-sm"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: 0.6 + index * 0.1,
                              duration: 0.3,
                            }}
                            whileHover={{ x: 5 }}
                          >
                            <div className="mt-0.5 mr-4 w-7 h-7 bg-[#008060] dark:bg-[#00a47c] rounded-full flex items-center justify-center flex-shrink-0 text-white font-medium">
                              {index + 1}
                            </div>
                            <p className="text-[#212326] dark:text-gray-200 leading-relaxed">
                              {recommendation}
                            </p>
                          </motion.li>
                        )
                      )}
                    </ul>
                  </div>
                </motion.div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => router.push("/")}
                    variant="outline"
                    className="border-[#dfe3e8] dark:border-gray-700 hover:border-[#008060] hover:bg-[#f6f6f7] dark:hover:bg-[#2c2c2e] text-[#212326] dark:text-white rounded-lg transition-all duration-300"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 17l-5-5m0 0l5-5m-5 5h12"
                      />
                    </svg>
                    Analyze Another Store
                  </Button>
                  <Button
                    className="bg-[#008060] hover:bg-[#004c3f] text-white rounded-lg shadow-lg shadow-[#008060]/20 hover:shadow-[#008060]/30 transition-all duration-300"
                    onClick={() => {
                      // Create a styled text version of the report for copying
                      const report = `
STORE ANALYSIS REPORT

Overall Score: ${analysisData.overallScore}/10 - ${getScoreLabel(
                        analysisData.overallScore
                      )}

Summary:
${analysisData.summary}

Category Scores:
- User Experience: ${analysisData.categoryScores.userExperience}/10
- Visual Design: ${analysisData.categoryScores.visualDesign}/10
- Performance: ${analysisData.categoryScores.performance}/10
- Accessibility: ${analysisData.categoryScores.accessibility}/10
- Conversion: ${analysisData.categoryScores.conversion}/10

STRENGTHS:
${analysisData.strengths
  .map((s) => `- ${s.title}: ${s.description}`)
  .join("\n")}

AREAS TO IMPROVE:
${analysisData.improvements
  .map((i) => `- ${i.title} (${i.priority} priority): ${i.description}`)
  .join("\n")}

DETAILED ANALYSIS:

Homepage Effectiveness:
${analysisData.detailedAnalysis.homepageEffectiveness}

Brand Clarity:
${analysisData.detailedAnalysis.brandClarity}

Usability Issues:
${analysisData.detailedAnalysis.usabilityIssues}

Mobile Experience:
${analysisData.detailedAnalysis.mobileExperience}

Checkout Process:
${analysisData.detailedAnalysis.checkoutProcess}

Color Scheme:
${analysisData.detailedAnalysis.colorScheme}

RECOMMENDATIONS:
${analysisData.actionableRecommendations
  .map((r, i) => `${i + 1}. ${r}`)
  .join("\n")}
                      `;

                      navigator.clipboard.writeText(report);
                      alert("Report copied to clipboard!");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                    Copy Full Report
                  </Button>
                </div>
              </>
            ) : null}
          </motion.div>
        </div>
      </main>

      {/* Footer - Shopify Style */}
      <footer className="bg-white dark:bg-[#1a1a1a] py-8 border-t border-[#dfe3e8] dark:border-gray-800">
        <div className="shopify-container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-[#6b7177] dark:text-gray-400 mb-4 md:mb-0">
              © 2023 Mystery Shopper. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-sm text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c] transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c] transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-sm text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c] transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
