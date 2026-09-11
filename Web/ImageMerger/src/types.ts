/**
 * Shared TypeScript contracts for image items, layout modes, and export settings.
 *
 * @author kimpro82
 * @date 2026.09.08
 * @history
 * 2026.09.06 - Defined the initial ImageMerger data and export types.
 * 2026.09.07 - Added size-standardization and aspect-ratio configuration types.
 */

/** Supported strategies for arranging images on the merged canvas. */
export type LayoutMode = 'auto' | 'horizontal' | 'vertical' | 'custom';

/** MIME types supported by the export workflow. */
export type ExportFormat = 'image/png' | 'image/jpeg' | 'image/webp';

/** Strategies used to standardize image dimensions without cropping. */
export type SizeStandardization = 'outlierMax' | 'rowEqualize' | 'original';

/** An uploaded image and the transformations currently applied to it. */
export interface ImageItem {
  /** Stable identifier used to associate DOM cards with image state. */
  id: string;
  /** Original file name displayed in the image list and used for accessibility text. */
  name: string;
  /** Decoded browser image used as the source for canvas drawing. */
  element: HTMLImageElement;
  /** Source image width before rotation or scaling. */
  originalWidth: number;
  /** Source image height before rotation or scaling. */
  originalHeight: number;
  /** User-selected scale multiplier applied to the source image. */
  scale: number;
  /** Whether the image is mirrored across the vertical axis. */
  flipH: boolean;
  /** Whether the image is mirrored across the horizontal axis. */
  flipV: boolean;
  /** Rotation in clockwise quarter-turn increments: 0, 90, 180, or 270 degrees. */
  rotation: number;
}

/** All user-controlled settings used to render and export the merged image. */
export interface CanvasSettings {
  /** Strategy used to determine the grid's row and column count. */
  layoutMode: LayoutMode;
  /** Requested column count when `layoutMode` is `custom`. */
  customColumns: number;
  /** Gap, in pixels, between neighboring grid cells. */
  spacing: number;
  /** Empty margin, in pixels, around the complete grid. */
  padding: number;
  /** A CSS color value or the literal value `transparent`. */
  backgroundColor: string;
  /** Output format selected for downloads. */
  exportFormat: ExportFormat;
  /** Encoded image quality between 0.1 and 1.0 for lossy formats. */
  exportQuality: number;
  /** Maximum output width in pixels; 0 means that no custom limit is applied. */
  /** Reserved maximum output width; currently zero for automatic sizing. */
  customWidthLimit: number;
  /** Strategy used to make image dimensions consistent across cells. */
  sizeStandardization: SizeStandardization;
  /** Whether an image may be stretched to fill its calculated cell. */
  allowAspectDistortion: boolean;
}

