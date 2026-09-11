/**
 * Application entry point that loads the stylesheet and starts ImageMergerApp.
 *
 * @author kimpro82
 * @date 2026.09.08
 * @history
 * 2026.09.06 - Initialized the ImageMerger application entry point.
 * 2026.09.08 - Kept startup wiring aligned with the panel and color-control updates.
 */

import './style.css';
import { ImageMergerApp } from './ui';

/** Start the application after the document structure has been parsed. */
document.addEventListener('DOMContentLoaded', () => {
  new ImageMergerApp();
});
