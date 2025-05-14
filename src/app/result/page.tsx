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
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#212326]">
      {/* Navigation - Shopify Style */}
      <header className="w-full bg-white dark:bg-[#212326] border-b border-[#dfe3e8] dark:border-gray-800">
        <div className="shopify-container flex justify-between items-center py-5">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-8 text-[#212326] dark:text-white">
              Mystery Shopper
            </h1>
            <nav className="hidden md:flex space-x-6">
              <a
                href="#features"
                className="text-[#6b7177] hover:text-[#212326] dark:text-gray-300 dark:hover:text-white text-base"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-[#6b7177] hover:text-[#212326] dark:text-gray-300 dark:hover:text-white text-base"
              >
                How it works
              </a>
              <a
                href="#pricing"
                className="text-[#6b7177] hover:text-[#212326] dark:text-gray-300 dark:hover:text-white text-base"
              >
                Pricing
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="text-[#212326] hover:text-[#008060] dark:text-white dark:hover:text-[#008060] text-base"
            >
              Log in
            </a>
            <Button className="bg-[#008060] hover:bg-[#004c3f] text-white rounded font-medium px-5 py-2.5">
              Start free
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Shopify Style */}
      <main className="flex-grow bg-[#f6f6f7] dark:bg-[#212326] py-12">
        <div className="shopify-container">
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-8">
              <a
                onClick={() => router.push("/")}
                className="flex items-center text-[#008060] dark:text-[#00a47c] cursor-pointer"
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
              <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm p-8 mb-8 flex items-center justify-center border border-[#dfe3e8] dark:border-gray-800 min-h-[40vh]">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008060] mb-4"></div>
                  <p className="text-lg text-[#212326] dark:text-white">
                    Analyzing your store...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm p-8 mb-8 border border-[#dfe3e8] dark:border-gray-800">
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
                  className="bg-[#008060] hover:bg-[#004c3f] text-white"
                >
                  Return to Homepage
                </Button>
              </div>
            ) : analysisData ? (
              <>
                {/* Overview Section */}
                <motion.div
                  className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm p-8 mb-8 border border-[#dfe3e8] dark:border-gray-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="flex flex-col md:flex-row mb-6 items-start">
                    <div className="w-full md:w-2/3 pr-0 md:pr-8 mb-6 md:mb-0">
                      <h2 className="text-2xl font-semibold mb-4 text-[#212326] dark:text-white">
                        Analysis Summary
                      </h2>
                      <p className="text-[#6b7177] dark:text-gray-400 mb-6">
                        {analysisData.summary}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        <div className="bg-[#f6f6f7] dark:bg-[#2c2c2e] p-4 rounded-lg text-center">
                          <div className="text-xl font-bold text-[#212326] dark:text-white mb-1">
                            {analysisData.categoryScores.userExperience}/10
                          </div>
                          <div className="text-xs text-[#6b7177] dark:text-gray-400">
                            User Experience
                          </div>
                        </div>
                        <div className="bg-[#f6f6f7] dark:bg-[#2c2c2e] p-4 rounded-lg text-center">
                          <div className="text-xl font-bold text-[#212326] dark:text-white mb-1">
                            {analysisData.categoryScores.visualDesign}/10
                          </div>
                          <div className="text-xs text-[#6b7177] dark:text-gray-400">
                            Visual Design
                          </div>
                        </div>
                        <div className="bg-[#f6f6f7] dark:bg-[#2c2c2e] p-4 rounded-lg text-center">
                          <div className="text-xl font-bold text-[#212326] dark:text-white mb-1">
                            {analysisData.categoryScores.performance}/10
                          </div>
                          <div className="text-xs text-[#6b7177] dark:text-gray-400">
                            Performance
                          </div>
                        </div>
                        <div className="bg-[#f6f6f7] dark:bg-[#2c2c2e] p-4 rounded-lg text-center">
                          <div className="text-xl font-bold text-[#212326] dark:text-white mb-1">
                            {analysisData.categoryScores.accessibility}/10
                          </div>
                          <div className="text-xs text-[#6b7177] dark:text-gray-400">
                            Accessibility
                          </div>
                        </div>
                        <div className="bg-[#f6f6f7] dark:bg-[#2c2c2e] p-4 rounded-lg text-center">
                          <div className="text-xl font-bold text-[#212326] dark:text-white mb-1">
                            {analysisData.categoryScores.conversion}/10
                          </div>
                          <div className="text-xs text-[#6b7177] dark:text-gray-400">
                            Conversion
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-1/3 bg-[#f6f6f7] dark:bg-[#2c2c2e] rounded-lg p-6 text-center">
                      <h3 className="text-lg font-semibold mb-2 text-[#212326] dark:text-white">
                        Overall Score
                      </h3>
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl font-bold text-[#212326] dark:text-white">
                            {analysisData.overallScore}
                          </span>
                        </div>
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#E6E6E6"
                            strokeWidth="3"
                            strokeDasharray="100, 100"
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
                            strokeWidth="3"
                            strokeDasharray={`${
                              analysisData.overallScore * 10
                            }, 100`}
                          />
                        </svg>
                      </div>
                      <p className="text-[#6b7177] dark:text-gray-400">
                        {getScoreLabel(analysisData.overallScore)}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <motion.div
                    className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm p-8 border border-[#dfe3e8] dark:border-gray-800"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <h2 className="text-xl font-semibold mb-4 text-[#212326] dark:text-white flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-[#008060]"
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
                      Strengths
                    </h2>
                    <ul className="space-y-4">
                      {analysisData.strengths.map((strength, index) => (
                        <li
                          key={index}
                          className="bg-[#f6f6f7] dark:bg-[#2c2c2e] p-4 rounded-lg"
                        >
                          <h3 className="font-medium text-[#212326] dark:text-white mb-1">
                            {strength.title}
                          </h3>
                          <p className="text-sm text-[#6b7177] dark:text-gray-400">
                            {strength.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div
                    className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm p-8 border border-[#dfe3e8] dark:border-gray-800"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <h2 className="text-xl font-semibold mb-4 text-[#212326] dark:text-white flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-[#d82c0d]"
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
                      Areas to Improve
                    </h2>
                    <ul className="space-y-4">
                      {analysisData.improvements.map((improvement, index) => (
                        <li
                          key={index}
                          className="bg-[#f6f6f7] dark:bg-[#2c2c2e] p-4 rounded-lg"
                        >
                          <div className="flex items-center mb-1">
                            <h3 className="font-medium text-[#212326] dark:text-white">
                              {improvement.title}
                            </h3>
                            <span
                              className={`ml-auto text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(
                                improvement.priority
                              )} bg-opacity-10`}
                            >
                              {improvement.priority} priority
                            </span>
                          </div>
                          <p className="text-sm text-[#6b7177] dark:text-gray-400">
                            {improvement.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                {/* Detailed Analysis */}
                <motion.div
                  className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm p-8 mb-8 border border-[#dfe3e8] dark:border-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <h2 className="text-xl font-semibold mb-6 text-[#212326] dark:text-white">
                    Detailed Analysis
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#f6f6f7] dark:bg-[#2c2c2e] p-5 rounded-lg">
                      <h3 className="text-[#212326] dark:text-white font-medium mb-2">
                        Homepage Effectiveness
                      </h3>
                      <p className="text-sm text-[#6b7177] dark:text-gray-400">
                        {analysisData.detailedAnalysis.homepageEffectiveness}
                      </p>
                    </div>

                    <div className="bg-[#f6f6f7] dark:bg-[#2c2c2e] p-5 rounded-lg">
                      <h3 className="text-[#212326] dark:text-white font-medium mb-2">
                        Brand Clarity
                      </h3>
                      <p className="text-sm text-[#6b7177] dark:text-gray-400">
                        {analysisData.detailedAnalysis.brandClarity}
                      </p>
                    </div>

                    <div className="bg-[#f6f6f7] dark:bg-[#2c2c2e] p-5 rounded-lg">
                      <h3 className="text-[#212326] dark:text-white font-medium mb-2">
                        Usability Issues
                      </h3>
                      <p className="text-sm text-[#6b7177] dark:text-gray-400">
                        {analysisData.detailedAnalysis.usabilityIssues}
                      </p>
                    </div>

                    <div className="bg-[#f6f6f7] dark:bg-[#2c2c2e] p-5 rounded-lg">
                      <h3 className="text-[#212326] dark:text-white font-medium mb-2">
                        Mobile Experience
                      </h3>
                      <p className="text-sm text-[#6b7177] dark:text-gray-400">
                        {analysisData.detailedAnalysis.mobileExperience}
                      </p>
                    </div>

                    <div className="bg-[#f6f6f7] dark:bg-[#2c2c2e] p-5 rounded-lg">
                      <h3 className="text-[#212326] dark:text-white font-medium mb-2">
                        Checkout Process
                      </h3>
                      <p className="text-sm text-[#6b7177] dark:text-gray-400">
                        {analysisData.detailedAnalysis.checkoutProcess}
                      </p>
                    </div>

                    <div className="bg-[#f6f6f7] dark:bg-[#2c2c2e] p-5 rounded-lg">
                      <h3 className="text-[#212326] dark:text-white font-medium mb-2">
                        Color Scheme
                      </h3>
                      <p className="text-sm text-[#6b7177] dark:text-gray-400">
                        {analysisData.detailedAnalysis.colorScheme}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Actionable Recommendations */}
                <motion.div
                  className="bg-[#d1e8e0] dark:bg-[#004c3f]/20 rounded-lg p-8 mb-8 border border-[#008060]/20 dark:border-[#008060]/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <h2 className="text-xl font-semibold mb-4 text-[#212326] dark:text-white">
                    Actionable Recommendations
                  </h2>
                  <ul className="space-y-3">
                    {analysisData.actionableRecommendations.map(
                      (recommendation, index) => (
                        <li key={index} className="flex items-start">
                          <div className="mt-0.5 mr-3 w-6 h-6 bg-[#008060] dark:bg-[#00a47c] rounded-full flex items-center justify-center flex-shrink-0 text-white">
                            {index + 1}
                          </div>
                          <p className="text-[#212326] dark:text-gray-200">
                            {recommendation}
                          </p>
                        </li>
                      )
                    )}
                  </ul>
                </motion.div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => router.push("/")}
                    variant="outline"
                    className="border-[#dfe3e8] dark:border-gray-700 hover:border-[#008060] hover:bg-[#f6f6f7] dark:hover:bg-[#2c2c2e] text-[#212326] dark:text-white"
                  >
                    Analyze Another Store
                  </Button>
                  <Button
                    className="bg-[#008060] hover:bg-[#004c3f] text-white"
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
                className="text-sm text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c]"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c]"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-sm text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c]"
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
