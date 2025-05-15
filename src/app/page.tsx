"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AnalysisResult } from "@/types/critique";
import Link from "next/link";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Add https if not present
      let targetUrl = url;
      if (
        !targetUrl.startsWith("http://") &&
        !targetUrl.startsWith("https://")
      ) {
        targetUrl = `https://${targetUrl}`;
      }

      const response = await fetch("/api/critique", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (response.ok) {
        const data: AnalysisResult = await response.json();

        // Save the analysis result and URL to localStorage
        localStorage.setItem("analyzedUrl", targetUrl);
        localStorage.setItem("analysisResult", JSON.stringify(data));

        router.push("/result");
      } else {
        // Handle errors
        const errorData = await response.json();
        setError(errorData.error || "Failed to analyze store");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-[#f6f6f7] dark:from-[#212326] dark:to-[#1a1a1a]">
      {/* Enhanced Navigation with Colorful Elements */}

      {/* Hero Section - Enhanced with Creative Elements */}
      <motion.section
        className="shopify-section relative overflow-hidden pt-16 pb-24 border-b border-[#dfe3e8] dark:border-transparent animated-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 blob-1 bg-[#d1e8e0] dark:bg-[#004c3f]/20 blur-3xl opacity-60"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 blob-2 bg-[#b3bcf5] dark:bg-[#444b77]/20 blur-3xl opacity-40"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 blob-3 bg-[#b7ecec] dark:bg-[#216e6c]/20 blur-3xl opacity-30"></div>

          <motion.div
            className="absolute top-1/4 right-1/3 w-4 h-4 bg-[#008060] rounded-full"
            animate={{
              y: [0, 20, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut",
            }}
          ></motion.div>
          <motion.div
            className="absolute bottom-1/3 left-1/4 w-6 h-6 bg-[#5c6ac4] rounded-full"
            animate={{
              y: [0, -30, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              repeat: Infinity,
              duration: 7,
              ease: "easeInOut",
            }}
          ></motion.div>
          <motion.div
            className="absolute top-2/3 right-1/4 w-5 h-5 bg-[#47c1bf] rounded-full"
            animate={{
              y: [0, 25, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut",
            }}
          ></motion.div>
        </div>

        <div className="shopify-container relative z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="flex justify-center mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <span className="px-4 py-1.5 bg-white dark:bg-[#1a1a1a] text-sm font-medium text-[#5c6ac4] dark:text-[#6e79d6] rounded-full shadow-purple flex items-center">
                <span className="w-2 h-2 bg-[#5c6ac4] dark:bg-[#6e79d6] rounded-full mr-2"></span>
                AI-Powered Store Analysis
              </span>
            </motion.div>

            <motion.h1
              className="shopify-heading text-center text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Analyze your Shopify store
              <span className="gradient-multi-text block mt-2">
                for maximum conversion
              </span>
            </motion.h1>

            <motion.p
              className="shopify-subheading text-center mb-10 max-w-3xl mx-auto text-lg md:text-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Get expert UX feedback on your store&apos;s design, user
              experience, and conversion optimization from our AI-powered
              analysis tool.
            </motion.p>

            <motion.form
              onSubmit={handleSubmit}
              className="max-w-2xl mx-auto mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row gap-3 relative">
                <input
                  type="text"
                  placeholder="Enter your store URL (e.g. mystore.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-grow rounded-lg border border-[#dfe3e8] dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-4 text-base focus:outline-none focus:ring-2 focus:ring-[#5c6ac4] dark:focus:ring-[#6e79d6] shadow-lg neumorphic"
                  required
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#5c6ac4] to-[#47c1bf] hover:from-[#47c1bf] hover:to-[#5c6ac4] text-white rounded-lg font-medium px-6 py-4 shadow-purple transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    </div>
                  ) : (
                    <div className="flex items-center">
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
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                      </svg>
                      Analyze Store
                    </div>
                  )}
                </Button>
              </div>
              {error && <p className="text-[#d82c0d] mt-2 text-sm">{error}</p>}
            </motion.form>

            <motion.div
              className="flex flex-col items-center justify-center gap-4 mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="h-px w-24 bg-gray-200 dark:bg-gray-700"></div>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                or try our visual feedback tool
              </p>
              <Link href="/annotate">
                <motion.button
                  className="group flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#1a1a1a] border border-[#dfe3e8] dark:border-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg
                    className="w-5 h-5 text-[#5c6ac4] group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="font-medium text-[#212326] dark:text-white">
                    Capture & Annotate Screenshots
                  </span>
                </motion.button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <motion.div
              className="card-gradient-1 group hover:shadow-xl hover:translate-y-[-5px] transition-all duration-300 border-2 relative overflow-hidden rounded-2xl p-7"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 blob-1 bg-[#008060]/10 rotate-45"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white dark:bg-[#212326] rounded-2xl shadow-green flex items-center justify-center mb-5 text-[#008060] dark:text-[#00a47c] transform group-hover:rotate-12 transition-all duration-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#212326] dark:text-white group-hover:text-[#008060] dark:group-hover:text-[#00a47c] transition-colors">
                  UX Analysis
                </h3>
                <p className="text-[#6b7177] dark:text-gray-400 leading-relaxed">
                  Get expert feedback on your store&apos;s user experience
                  design and flow to reduce friction and increase sales.
                </p>
                <div className="mt-4 flex justify-end">
                  <span className="text-[#008060] dark:text-[#00a47c] text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn more
                    <svg
                      className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="card-gradient-2 group hover:shadow-xl hover:translate-y-[-5px] transition-all duration-300 border-2 relative overflow-hidden rounded-2xl p-7"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 blob-2 bg-[#5c6ac4]/10 rotate-45"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white dark:bg-[#212326] rounded-2xl shadow-purple flex items-center justify-center mb-5 text-[#5c6ac4] dark:text-[#6e79d6] transform group-hover:rotate-12 transition-all duration-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#212326] dark:text-white group-hover:text-[#5c6ac4] dark:group-hover:text-[#6e79d6] transition-colors">
                  Performance Improvements
                </h3>
                <p className="text-[#6b7177] dark:text-gray-400 leading-relaxed">
                  Identify issues that might be hurting your conversion rates
                  and get actionable recommendations.
                </p>
                <div className="mt-4 flex justify-end">
                  <span className="text-[#5c6ac4] dark:text-[#6e79d6] text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn more
                    <svg
                      className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="card-gradient-3 group hover:shadow-xl hover:translate-y-[-5px] transition-all duration-300 border-2 relative overflow-hidden rounded-2xl p-7"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 blob-3 bg-[#47c1bf]/10 rotate-45"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white dark:bg-[#212326] rounded-2xl shadow-teal flex items-center justify-center mb-5 text-[#47c1bf] dark:text-[#2ed0cd] transform group-hover:rotate-12 transition-all duration-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#212326] dark:text-white group-hover:text-[#47c1bf] dark:group-hover:text-[#2ed0cd] transition-colors">
                  Actionable Insights
                </h3>
                <p className="text-[#6b7177] dark:text-gray-400 leading-relaxed">
                  Get practical recommendations you can implement right away to
                  improve your store&apos;s performance.
                </p>
                <div className="mt-4 flex justify-end">
                  <span className="text-[#47c1bf] dark:text-[#2ed0cd] text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn more
                    <svg
                      className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section - Enhanced */}
      <section className="shopify-section bg-white dark:bg-[#212326] relative overflow-hidden py-24">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-40 left-20 w-72 h-72 blob-2 bg-[#d1e8e0]/30 dark:bg-[#004c3f]/10 blur-2xl"></div>
          <div className="absolute bottom-40 right-20 w-72 h-72 blob-1 bg-[#b3bcf5]/30 dark:bg-[#5c6ac4]/10 blur-2xl"></div>
          <svg
            className="absolute top-0 right-0 text-[#f6f6f7] dark:text-[#1a1a1a] w-full h-auto opacity-70"
            fill="currentColor"
            viewBox="0 0 600 600"
          >
            <path d="M488.6 250.2L392 214V105.5c0-15-9.3-28.4-23.4-33.7l-100-37.5c-8.1-3.1-17.1-3.1-25.3 0l-100 37.5c-14.1 5.3-23.4 18.7-23.4 33.7V214l-96.6 36.2C9.3 255.5 0 268.9 0 283.9v114.6c0 15 9.3 28.4 23.4 33.7l100 37.5c8.1 3.1 17.1 3.1 25.3 0l100-37.5c14.1-5.3 23.4-18.7 23.4-33.7V283.9c0-15-9.3-28.4-23.4-33.7zM358 214.8l-85 31.9v-68.2l85-37v73.3zM154 104.1l102-38.2 102 38.2v.6l-102 41.4-102-41.4v-.6zm84 291.1l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6zm240 112l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6z"></path>
          </svg>
        </div>

        <div className="shopify-container relative z-10">
          <div className="text-center mb-16">
            <motion.span
              className="inline-block text-[#008060] dark:text-[#00a47c] font-medium mb-3 bg-[#d1e8e0] dark:bg-[#004c3f]/20 px-4 py-1 rounded-full text-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              WHY MYSTERY SHOPPER
            </motion.span>
            <motion.h2
              className="shopify-heading mb-6 gradient-multi-text"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Get a complete analysis of your store
            </motion.h2>
            <motion.p
              className="shopify-subheading max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Our AI-powered tool analyzes your Shopify store from multiple
              angles to provide comprehensive feedback and actionable insights.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              className="flex flex-col justify-center"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-start mb-8 bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="mt-1 mr-5 w-12 h-12 bg-[#d1e8e0] dark:bg-[#004c3f]/50 rounded-full flex items-center justify-center flex-shrink-0 text-[#008060] dark:text-[#00a47c]">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[#212326] dark:text-white">
                    Design & Visual Hierarchy
                  </h3>
                  <p className="text-[#6b7177] dark:text-gray-400">
                    Evaluate your store&apos;s visual appeal, branding
                    consistency, and overall design aesthetics.
                  </p>
                </div>
              </div>

              <div className="flex items-start mb-8 bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-[#dfe3e8] dark:border-gray-800">
                <div className="mt-1 mr-5 w-12 h-12 bg-[#d1e8e0] dark:bg-[#004c3f]/50 rounded-full flex items-center justify-center flex-shrink-0 text-[#008060] dark:text-[#00a47c]">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[#212326] dark:text-white">
                    User Experience & Navigation
                  </h3>
                  <p className="text-[#6b7177] dark:text-gray-400">
                    Analyze user flow, navigation structure, and ease of use to
                    reduce customer friction.
                  </p>
                </div>
              </div>

              <div className="flex items-start bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-[#dfe3e8] dark:border-gray-800">
                <div className="mt-1 mr-5 w-12 h-12 bg-[#d1e8e0] dark:bg-[#004c3f]/50 rounded-full flex items-center justify-center flex-shrink-0 text-[#008060] dark:text-[#00a47c]">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[#212326] dark:text-white">
                    Conversion Optimization
                  </h3>
                  <p className="text-[#6b7177] dark:text-gray-400">
                    Identify barriers to purchase and get recommendations to
                    improve conversion rates.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-[#f6f6f7] to-white dark:from-[#1a1a1a] dark:to-[#212326] rounded-2xl p-8 lg:p-10 shadow-xl border border-[#dfe3e8] dark:border-gray-800 relative overflow-hidden"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#d1e8e0] dark:bg-[#004c3f]/20 rounded-full blur-3xl -mr-20 -mt-20 opacity-50"></div>
              <div className="relative z-10">
                <div className="aspect-w-16 aspect-h-9 bg-[#008060]/10 dark:bg-[#008060]/20 rounded-xl mb-8 overflow-hidden">
                  <div className="flex items-center justify-center h-full p-8">
                    <div className="bg-white dark:bg-[#212326] p-6 rounded-lg shadow-lg w-full max-w-md">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-[#008060] rounded-full text-white flex items-center justify-center mr-3 text-sm font-bold">
                            8.5
                          </div>
                          <h4 className="font-semibold text-[#212326] dark:text-white">
                            Overall Score
                          </h4>
                        </div>
                        <span className="text-[#008060] dark:text-[#00a47c] bg-[#d1e8e0] dark:bg-[#004c3f]/20 px-2 py-1 rounded text-xs font-medium">
                          Excellent
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#6b7177] dark:text-gray-400">
                            UX Score
                          </span>
                          <div className="flex items-center">
                            <div className="w-32 h-2 bg-[#dfe3e8] dark:bg-gray-700 rounded-full overflow-hidden mr-2">
                              <div
                                className="h-full bg-[#008060] dark:bg-[#00a47c] rounded-full"
                                style={{ width: "90%" }}
                              ></div>
                            </div>
                            <span className="text-[#212326] dark:text-white font-medium">
                              9/10
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#6b7177] dark:text-gray-400">
                            Visual Design
                          </span>
                          <div className="flex items-center">
                            <div className="w-32 h-2 bg-[#dfe3e8] dark:bg-gray-700 rounded-full overflow-hidden mr-2">
                              <div
                                className="h-full bg-[#008060] dark:bg-[#00a47c] rounded-full"
                                style={{ width: "80%" }}
                              ></div>
                            </div>
                            <span className="text-[#212326] dark:text-white font-medium">
                              8/10
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#6b7177] dark:text-gray-400">
                            Conversion
                          </span>
                          <div className="flex items-center">
                            <div className="w-32 h-2 bg-[#dfe3e8] dark:bg-gray-700 rounded-full overflow-hidden mr-2">
                              <div
                                className="h-full bg-[#008060] dark:bg-[#00a47c] rounded-full"
                                style={{ width: "85%" }}
                              ></div>
                            </div>
                            <span className="text-[#212326] dark:text-white font-medium">
                              8.5/10
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#212326] dark:text-white">
                  Comprehensive Report
                </h3>
                <p className="text-[#6b7177] dark:text-gray-400 mb-5">
                  Get a detailed analysis report covering all aspects of your
                  store with clear, actionable recommendations.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block px-3 py-1 bg-[#d1e8e0] dark:bg-[#004c3f]/40 text-[#008060] dark:text-[#00a47c] text-xs font-medium rounded-full">
                    UX Score
                  </span>
                  <span className="inline-block px-3 py-1 bg-[#d1e8e0] dark:bg-[#004c3f]/40 text-[#008060] dark:text-[#00a47c] text-xs font-medium rounded-full">
                    Conversion Analysis
                  </span>
                  <span className="inline-block px-3 py-1 bg-[#d1e8e0] dark:bg-[#004c3f]/40 text-[#008060] dark:text-[#00a47c] text-xs font-medium rounded-full">
                    Design Feedback
                  </span>
                  <span className="inline-block px-3 py-1 bg-[#d1e8e0] dark:bg-[#004c3f]/40 text-[#008060] dark:text-[#00a47c] text-xs font-medium rounded-full">
                    Mobile Experience
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Button
                onClick={() =>
                  document
                    .querySelector("form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-[#008060] hover:bg-[#004c3f] text-white rounded-lg font-medium px-8 py-3 shadow-lg shadow-[#008060]/20 hover:shadow-[#008060]/30 transition-all duration-300"
              >
                Try Mystery Shopper Now
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer - Shopify Style */}
      {/* <footer className="bg-[#f6f6f7] dark:bg-[#1a1a1a] py-16 border-t border-[#dfe3e8] dark:border-gray-800">
        <div className="shopify-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#212326] dark:text-white flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-[#008060]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm1-9.92V9h4c-.58-2.5-2.91-4-5.5-4S5.58 6.5 5 9h4v-.92c-1.15.33-2 1.39-2 2.64v1.56c0 1.52 1.23 2.75 2.75 2.75s2.75-1.23 2.75-2.75v-1.56c0-1.25-.85-2.31-2-2.64z" />
                </svg>
                Mystery Shopper
              </h3>
              <p className="text-[#6b7177] dark:text-gray-400 mb-4">
                AI-powered analysis for Shopify stores to improve conversions
                and user experience.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-8 h-8 bg-[#f6f6f7] dark:bg-[#212326] rounded-full flex items-center justify-center text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c] border border-[#dfe3e8] dark:border-gray-700 hover:border-[#008060] dark:hover:border-[#00a47c] transition-colors"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-[#f6f6f7] dark:bg-[#212326] rounded-full flex items-center justify-center text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c] border border-[#dfe3e8] dark:border-gray-700 hover:border-[#008060] dark:hover:border-[#00a47c] transition-colors"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-[#f6f6f7] dark:bg-[#212326] rounded-full flex items-center justify-center text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c] border border-[#dfe3e8] dark:border-gray-700 hover:border-[#008060] dark:hover:border-[#00a47c] transition-colors"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[#6b7177] dark:text-gray-300">
                Product
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c] transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c] transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c] transition-colors"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c] transition-colors"
                  >
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[#6b7177] dark:text-gray-300">
                Resources
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c] transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c] transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c] transition-colors"
                  >
                    API Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c] transition-colors"
                  >
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[#6b7177] dark:text-gray-300">
                Company
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c] transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c] transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c] transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c] transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#dfe3e8] dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-[#6b7177] dark:text-gray-400 mb-4 md:mb-0">
              © 2023 Mystery Shopper. All rights reserved.
            </p>
            <div className="flex items-center">
              <span className="text-sm text-[#6b7177] dark:text-gray-400 mr-2">
                Powered by
              </span>
              <span className="text-sm font-semibold text-[#212326] dark:text-white">
                Mystery Shopper Inc.
              </span>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
