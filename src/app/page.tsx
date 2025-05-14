"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AnalysisResult } from "@/types/critique";

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
      const response = await fetch("/api/critique", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const data: AnalysisResult = await response.json();

        // Save the analysis result and URL to localStorage
        localStorage.setItem("analyzedUrl", url);
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

      {/* Hero Section - Shopify Style */}
      <motion.section
        className="shopify-section bg-[#f6f6f7] dark:bg-[#212326] border-b border-[#dfe3e8] dark:border-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="shopify-container">
          <div className="max-w-5xl mx-auto">
            <motion.h1
              className="shopify-heading text-center text-5xl sm:text-6xl md:text-7xl mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Analyze your Shopify store
              <span className="text-[#008060] dark:text-[#00a47c] block">
                for maximum conversion
              </span>
            </motion.h1>

            <motion.p
              className="shopify-subheading text-center mb-10 max-w-3xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Get expert UX feedback on your store's design, user experience,
              and conversion optimization from our AI-powered analysis tool.
            </motion.p>

            <motion.form
              onSubmit={handleSubmit}
              className="max-w-2xl mx-auto mb-16"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="url"
                  placeholder="Enter your Shopify store URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-grow rounded border border-[#dfe3e8] dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#008060]"
                  required
                />
                <Button
                  type="submit"
                  className="bg-[#008060] hover:bg-[#004c3f] text-white rounded font-medium px-6 py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Analyzing..." : "Analyze Store"}
                </Button>
              </div>
            </motion.form>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="shopify-card group hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-[#d1e8e0] dark:bg-[#004c3f] rounded-full flex items-center justify-center mb-4 text-[#008060] dark:text-white">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#212326] dark:text-white group-hover:text-[#008060] dark:group-hover:text-[#00a47c] transition-colors">
                UX Analysis
              </h3>
              <p className="text-[#6b7177] dark:text-gray-400">
                Get expert feedback on your store's user experience design and
                flow to reduce friction and increase sales.
              </p>
            </div>

            <div className="shopify-card group hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-[#d1e8e0] dark:bg-[#004c3f] rounded-full flex items-center justify-center mb-4 text-[#008060] dark:text-white">
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
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#212326] dark:text-white group-hover:text-[#008060] dark:group-hover:text-[#00a47c] transition-colors">
                Performance Improvements
              </h3>
              <p className="text-[#6b7177] dark:text-gray-400">
                Identify issues that might be hurting your conversion rates and
                get actionable recommendations.
              </p>
            </div>

            <div className="shopify-card group hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-[#d1e8e0] dark:bg-[#004c3f] rounded-full flex items-center justify-center mb-4 text-[#008060] dark:text-white">
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
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#212326] dark:text-white group-hover:text-[#008060] dark:group-hover:text-[#00a47c] transition-colors">
                Actionable Insights
              </h3>
              <p className="text-[#6b7177] dark:text-gray-400">
                Get practical recommendations you can implement right away to
                improve your store's performance.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="shopify-section bg-white dark:bg-[#212326]">
        <div className="shopify-container">
          <div className="text-center mb-16">
            <span className="inline-block text-[#008060] dark:text-[#00a47c] font-medium mb-3">
              WHY MYSTERY SHOPPER
            </span>
            <h2 className="shopify-heading mb-6">
              Get a complete analysis of your store
            </h2>
            <p className="shopify-subheading max-w-3xl mx-auto">
              Our AI-powered tool analyzes your Shopify store from multiple
              angles to provide comprehensive feedback and actionable insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            <div className="flex flex-col justify-center">
              <div className="flex items-start mb-6">
                <div className="mt-1 mr-4 w-8 h-8 bg-[#d1e8e0] dark:bg-[#004c3f] rounded-full flex items-center justify-center flex-shrink-0 text-[#008060] dark:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
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
                  <h3 className="text-lg font-semibold mb-2 text-[#212326] dark:text-white">
                    Design & Visual Hierarchy
                  </h3>
                  <p className="text-[#6b7177] dark:text-gray-400">
                    Evaluate your store's visual appeal, branding consistency,
                    and overall design aesthetics.
                  </p>
                </div>
              </div>

              <div className="flex items-start mb-6">
                <div className="mt-1 mr-4 w-8 h-8 bg-[#d1e8e0] dark:bg-[#004c3f] rounded-full flex items-center justify-center flex-shrink-0 text-[#008060] dark:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
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
                  <h3 className="text-lg font-semibold mb-2 text-[#212326] dark:text-white">
                    User Experience & Navigation
                  </h3>
                  <p className="text-[#6b7177] dark:text-gray-400">
                    Analyze user flow, navigation structure, and ease of use to
                    reduce customer friction.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mt-1 mr-4 w-8 h-8 bg-[#d1e8e0] dark:bg-[#004c3f] rounded-full flex items-center justify-center flex-shrink-0 text-[#008060] dark:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
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
                  <h3 className="text-lg font-semibold mb-2 text-[#212326] dark:text-white">
                    Conversion Optimization
                  </h3>
                  <p className="text-[#6b7177] dark:text-gray-400">
                    Identify barriers to purchase and get recommendations to
                    improve conversion rates.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#f6f6f7] dark:bg-[#1a1a1a] rounded-lg p-6 lg:p-8">
              <div className="aspect-w-16 aspect-h-9 bg-[#dfe3e8] dark:bg-gray-800 rounded mb-6">
                <div className="flex items-center justify-center h-full text-[#6b7177] dark:text-gray-400">
                  [Analysis Report Preview]
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#212326] dark:text-white">
                Comprehensive Report
              </h3>
              <p className="text-[#6b7177] dark:text-gray-400 mb-4">
                Get a detailed analysis report covering all aspects of your
                store with clear, actionable recommendations.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-block px-3 py-1 bg-[#d1e8e0] dark:bg-[#004c3f] text-[#008060] dark:text-white text-xs font-medium rounded-full">
                  UX Score
                </span>
                <span className="inline-block px-3 py-1 bg-[#d1e8e0] dark:bg-[#004c3f] text-[#008060] dark:text-white text-xs font-medium rounded-full">
                  Conversion Analysis
                </span>
                <span className="inline-block px-3 py-1 bg-[#d1e8e0] dark:bg-[#004c3f] text-[#008060] dark:text-white text-xs font-medium rounded-full">
                  Design Feedback
                </span>
                <span className="inline-block px-3 py-1 bg-[#d1e8e0] dark:bg-[#004c3f] text-[#008060] dark:text-white text-xs font-medium rounded-full">
                  Mobile Experience
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Shopify Style */}
      <footer className="bg-[#f6f6f7] dark:bg-[#1a1a1a] py-16 border-t border-[#dfe3e8] dark:border-gray-800">
        <div className="shopify-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#212326] dark:text-white">
                Mystery Shopper
              </h3>
              <p className="text-[#6b7177] dark:text-gray-400 mb-4">
                AI-powered analysis for Shopify stores to improve conversions
                and user experience.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c]"
                >
                  <svg
                    className="h-5 w-5"
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
                  className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c]"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c]"
                >
                  <svg
                    className="h-5 w-5"
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
                    className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c]"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c]"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c]"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c]"
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
                    className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c]"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c]"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c]"
                  >
                    API Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c]"
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
                    className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c]"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c]"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c]"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#6b7177] hover:text-[#008060] dark:text-gray-400 dark:hover:text-[#00a47c]"
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
      </footer>
    </div>
  );
}
