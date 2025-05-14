// Define interfaces for our data structures
export interface StyleData {
  element?: string;
  class?: string;
  style?: string;
  type?: string;
  content?: string | null;
}

export interface LayoutInfo {
  hasHeader: boolean;
  hasFooter: boolean;
  hasNavigation: boolean;
  hasSidebar: boolean;
}

export interface UIComponents {
  buttons: number;
  forms: number;
  images: number;
  videos: number;
  carousels: number;
}

export interface SiteAnalysis {
  url: string;
  bodyText: string;
  styleInfo: {
    inlineStyles: StyleData[];
    stylesheetUrls: string[];
    colorPalette: string[];
  };
  layout: LayoutInfo;
  uiComponents: UIComponents;
}

// Interface for structured analysis results
export interface AnalysisResult {
  overallScore: number;
  summary: string;
  categoryScores: {
    userExperience: number;
    visualDesign: number;
    performance: number;
    accessibility: number;
    conversion: number;
  };
  strengths: Array<{
    title: string;
    description: string;
  }>;
  improvements: Array<{
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  }>;
  detailedAnalysis: {
    homepageEffectiveness: string;
    brandClarity: string;
    usabilityIssues: string;
    mobileExperience: string;
    checkoutProcess: string;
    colorScheme: string;
  };
  actionableRecommendations: string[];
  rawFeedback?: string;
}
