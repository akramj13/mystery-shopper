"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnnotationTemplate {
  id: string;
  type: "error" | "warning" | "suggestion";
  text: string;
}

interface AnnotationHelperProps {
  onSelectTemplate: (template: {
    text: string;
    type: "error" | "warning" | "suggestion";
  }) => void;
}

export default function AnnotationHelper({
  onSelectTemplate,
}: AnnotationHelperProps) {
  const templates: AnnotationTemplate[] = [
    { id: "too-much-text", type: "error", text: "Too much text here" },
    {
      id: "low-contrast",
      type: "warning",
      text: "Call to action needs better contrast",
    },
    { id: "responsive-issue", type: "error", text: "Responsive layout issue" },
    { id: "slow-loading", type: "warning", text: "Slow loading element" },
    { id: "improve-spacing", type: "suggestion", text: "Improve spacing here" },
    { id: "accessbility", type: "error", text: "Accessibility issue" },
    {
      id: "font-size",
      type: "suggestion",
      text: "Increase font size for readability",
    },
    {
      id: "visual-hierarchy",
      type: "suggestion",
      text: "Improve visual hierarchy",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="bg-[#f6f6f7] dark:bg-[#212326] rounded-lg p-4 border border-[#dfe3e8] dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-3 text-[#212326] dark:text-white flex items-center">
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
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        Common Issues
      </h3>
      <p className="text-sm text-[#6b7177] dark:text-gray-400 mb-4">
        Click an issue below to quickly add it to your selected annotation
      </p>

      <motion.div
        className="grid grid-cols-1 gap-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {templates.map((template) => {
          // Define styling based on template type using Shopify colors
          const getBgClass = () => {
            switch (template.type) {
              case "error":
                return "bg-white dark:bg-[#212326] border-red-500 dark:border-red-700";
              case "warning":
                return "bg-white dark:bg-[#212326] border-[#f49342] dark:border-[#f49342]";
              case "suggestion":
                return "bg-white dark:bg-[#212326] border-[#008060] dark:border-[#00a47c]";
            }
          };

          const getTextClass = () => {
            switch (template.type) {
              case "error":
                return "text-red-600 dark:text-red-400";
              case "warning":
                return "text-[#f49342] dark:text-[#f49342]";
              case "suggestion":
                return "text-[#008060] dark:text-[#00a47c]";
            }
          };

          const getIconSvg = () => {
            switch (template.type) {
              case "error":
                return (
                  <svg
                    className="h-5 w-5 mr-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                );
              case "warning":
                return (
                  <svg
                    className="h-5 w-5 mr-2 flex-shrink-0"
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
                );
              case "suggestion":
                return (
                  <svg
                    className="h-5 w-5 mr-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                );
            }
          };

          return (
            <motion.button
              key={template.id}
              onClick={() =>
                onSelectTemplate({ type: template.type, text: template.text })
              }
              className={`p-3 rounded-lg border ${getBgClass()} ${getTextClass()} text-left transition-all duration-200 flex items-center hover:shadow-md hover:-translate-y-0.5`}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {getIconSvg()}
              <span>{template.text}</span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
