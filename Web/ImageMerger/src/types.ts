export type LayoutMode = 'auto' | 'horizontal' | 'vertical' | 'custom';
export type ExportFormat = 'image/png' | 'image/jpeg' | 'image/webp';
export type SizeStandardization = 'outlierMax' | 'rowEqualize' | 'original';

export interface ImageItem {
  id: string;
  name: string;
  element: HTMLImageElement;
  originalWidth: number;
  originalHeight: number;
  scale: number;
  flipH: boolean;
  flipV: boolean;
  rotation: number; // 0, 90, 180, 270
}

export interface CanvasSettings {
  layoutMode: LayoutMode;
  customColumns: number;
  spacing: number;
  padding: number;
  backgroundColor: string; // hex color or 'transparent'
  exportFormat: ExportFormat;
  exportQuality: number; // 0.1 to 1.0
  customWidthLimit: number; // 0 = original resolution calculated, or max width in px
  sizeStandardization: SizeStandardization; // Standardization strategy without cropping
  allowAspectDistortion: boolean; // Allow aspect ratio change to fit exact cell dimensions
}

