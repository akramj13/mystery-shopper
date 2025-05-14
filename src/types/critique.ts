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
