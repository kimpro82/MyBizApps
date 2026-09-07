import { CanvasSettings, ImageItem, LayoutMode } from './types';

export function calculateOutlierMax(values: number[]): number {
  if (values.length === 0) return 0;
  if (values.length <= 2) return Math.max(...values);

  const sorted = [...values].slice().sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const upperBound = q3 + 1.5 * iqr;

  const validValues = sorted.filter((v) => v <= upperBound);
  return validValues.length > 0 ? Math.max(...validValues) : sorted[sorted.length - 1];
}

export function calculateGridDimensions(
  count: number,
  mode: LayoutMode,
  customColumns: number
): { columns: number; rows: number } {
  if (count <= 0) return { columns: 0, rows: 0 };

  switch (mode) {
    case 'horizontal':
      return { columns: count, rows: 1 };
    case 'vertical':
      return { columns: 1, rows: count };
    case 'custom': {
      const cols = Math.max(1, Math.min(count, customColumns));
      return { columns: cols, rows: Math.ceil(count / cols) };
    }
    case 'auto':
    default: {
      // Dynamic auto layout aiming for balanced square / 4:3 grid
      if (count === 1) return { columns: 1, rows: 1 };
      if (count === 2) return { columns: 2, rows: 1 };
      if (count === 3) return { columns: 3, rows: 1 };
      if (count === 4) return { columns: 2, rows: 2 };
      
      const cols = Math.ceil(Math.sqrt(count));
      return { columns: cols, rows: Math.ceil(count / cols) };
    }
  }
}

export function renderMergedCanvas(
  canvas: HTMLCanvasElement,
  items: ImageItem[],
  settings: CanvasSettings
): { width: number; height: number } {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { width: 0, height: 0 };

  if (items.length === 0) {
    canvas.width = 800;
    canvas.height = 420;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw modern empty state canvas placeholder
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#94a3af';
    ctx.font = '500 16px "Noto Sans KR", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('업로드된 이미지가 없습니다.', canvas.width / 2, canvas.height / 2 - 12);

    ctx.fillStyle = '#64748b';
    ctx.font = '400 13px "Noto Sans KR", sans-serif';
    ctx.fillText('왼쪽 영역에 이미지를 드래그하거나 선택하여 병합을 시작하세요.', canvas.width / 2, canvas.height / 2 + 16);

    return { width: canvas.width, height: canvas.height };
  }

  const { columns, rows } = calculateGridDimensions(
    items.length,
    settings.layoutMode,
    settings.customColumns
  );

  // Prepare aspect ratios and native dimensions for items
  const itemDimensions = items.map((item) => {
    const isRotated90or270 = item.rotation % 180 !== 0;
    const nativeW = isRotated90or270 ? item.originalHeight : item.originalWidth;
    const nativeH = isRotated90or270 ? item.originalWidth : item.originalHeight;
    const aspect = nativeW / nativeH;

    return {
      item,
      nativeW,
      nativeH,
      aspect,
      isRotated90or270,
    };
  });

  // Calculate target heights based on standardization setting (preventing cropping)
  let targetHeights: number[] = [];

  if (settings.sizeStandardization === 'outlierMax') {
    const rawHeights = itemDimensions.map((d) => d.nativeH * d.item.scale);
    const globalTargetH = calculateOutlierMax(rawHeights);
    targetHeights = new Array(items.length).fill(globalTargetH);
  } else if (settings.sizeStandardization === 'rowEqualize') {
    targetHeights = new Array(items.length).fill(0);
    for (let r = 0; r < rows; r++) {
      const rowIndexes: number[] = [];
      for (let i = 0; i < items.length; i++) {
        if (Math.floor(i / columns) === r) {
          rowIndexes.push(i);
        }
      }
      const rowRawHeights = rowIndexes.map((idx) => itemDimensions[idx].nativeH * itemDimensions[idx].item.scale);
      const rowTargetH = calculateOutlierMax(rowRawHeights);
      rowIndexes.forEach((idx) => {
        targetHeights[idx] = rowTargetH;
      });
    }
  }

  const computedItems = itemDimensions.map((d, index) => {
    let effWidth: number;
    let effHeight: number;
    let effectiveScaleFactor: number;

    if (settings.sizeStandardization === 'original') {
      effWidth = d.nativeW * d.item.scale;
      effHeight = d.nativeH * d.item.scale;
      effectiveScaleFactor = d.item.scale;
    } else {
      const targetH = targetHeights[index];
      effHeight = targetH * d.item.scale;
      effWidth = targetH * d.aspect * d.item.scale;
      effectiveScaleFactor = effHeight / d.nativeH;
    }

    return {
      ...d,
      effWidth,
      effHeight,
      effectiveScaleFactor,
    };
  });

  // Calculate cell widths and heights
  const colWidths: number[] = new Array(columns).fill(0);
  const rowHeights: number[] = new Array(rows).fill(0);

  computedItems.forEach((cItem, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);

    if (cItem.effWidth > colWidths[col]) colWidths[col] = cItem.effWidth;
    if (cItem.effHeight > rowHeights[row]) rowHeights[row] = cItem.effHeight;
  });

  const totalColWidth = colWidths.reduce((a, b) => a + b, 0);
  const totalRowHeight = rowHeights.reduce((a, b) => a + b, 0);

  const canvasWidth = Math.round(
    settings.padding * 2 + totalColWidth + Math.max(0, columns - 1) * settings.spacing
  );
  const canvasHeight = Math.round(
    settings.padding * 2 + totalRowHeight + Math.max(0, rows - 1) * settings.spacing
  );

  canvas.width = Math.max(1, canvasWidth);
  canvas.height = Math.max(1, canvasHeight);

  // Background rendering
  if (settings.backgroundColor === 'transparent') {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = settings.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Draw images inside grid cells (aspect ratio preserved, no crop)
  computedItems.forEach((cItem, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);

    let cellX = settings.padding;
    for (let c = 0; c < col; c++) {
      cellX += colWidths[c] + settings.spacing;
    }

    let cellY = settings.padding;
    for (let r = 0; r < row; r++) {
      cellY += rowHeights[r] + settings.spacing;
    }

    const cellW = colWidths[col];
    const cellH = rowHeights[row];

    const drawX = cellX + (cellW - cItem.effWidth) / 2;
    const drawY = cellY + (cellH - cItem.effHeight) / 2;

    const rawDrawWidth = cItem.item.originalWidth * cItem.effectiveScaleFactor;
    const rawDrawHeight = cItem.item.originalHeight * cItem.effectiveScaleFactor;

    ctx.save();
    ctx.translate(drawX + cItem.effWidth / 2, drawY + cItem.effHeight / 2);

    if (cItem.item.rotation !== 0) {
      ctx.rotate((cItem.item.rotation * Math.PI) / 180);
    }

    const scaleX = cItem.item.flipH ? -1 : 1;
    const scaleY = cItem.item.flipV ? -1 : 1;
    ctx.scale(scaleX, scaleY);

    ctx.drawImage(
      cItem.item.element,
      -rawDrawWidth / 2,
      -rawDrawHeight / 2,
      rawDrawWidth,
      rawDrawHeight
    );

    ctx.restore();
  });

  return { width: canvas.width, height: canvas.height };
}

