export function calculateGridDimensions(count, mode, customColumns) {
    if (count <= 0)
        return { columns: 0, rows: 0 };
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
            if (count === 1)
                return { columns: 1, rows: 1 };
            if (count === 2)
                return { columns: 2, rows: 1 };
            if (count === 3)
                return { columns: 3, rows: 1 };
            if (count === 4)
                return { columns: 2, rows: 2 };
            const cols = Math.ceil(Math.sqrt(count));
            return { columns: cols, rows: Math.ceil(count / cols) };
        }
    }
}
export function renderMergedCanvas(canvas, items, settings) {
    const ctx = canvas.getContext('2d');
    if (!ctx)
        return { width: 0, height: 0 };
    if (items.length === 0) {
        canvas.width = 800;
        canvas.height = 400;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw placeholder pattern or message
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#9ca3af';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('No images uploaded yet. Drag & drop or click "Add Images" to start.', canvas.width / 2, canvas.height / 2);
        return { width: canvas.width, height: canvas.height };
    }
    const { columns, rows } = calculateGridDimensions(items.length, settings.layoutMode, settings.customColumns);
    // Calculate cell widths and heights
    const colWidths = new Array(columns).fill(0);
    const rowHeights = new Array(rows).fill(0);
    items.forEach((item, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);
        const isRotated90or270 = item.rotation % 180 !== 0;
        const effWidth = (isRotated90or270 ? item.originalHeight : item.originalWidth) * item.scale;
        const effHeight = (isRotated90or270 ? item.originalWidth : item.originalHeight) * item.scale;
        if (effWidth > colWidths[col])
            colWidths[col] = effWidth;
        if (effHeight > rowHeights[row])
            rowHeights[row] = effHeight;
    });
    const totalColWidth = colWidths.reduce((a, b) => a + b, 0);
    const totalRowHeight = rowHeights.reduce((a, b) => a + b, 0);
    const canvasWidth = Math.round(settings.padding * 2 + totalColWidth + Math.max(0, columns - 1) * settings.spacing);
    const canvasHeight = Math.round(settings.padding * 2 + totalRowHeight + Math.max(0, rows - 1) * settings.spacing);
    canvas.width = Math.max(1, canvasWidth);
    canvas.height = Math.max(1, canvasHeight);
    // Background rendering
    if (settings.backgroundColor === 'transparent') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    else {
        ctx.fillStyle = settings.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    // Draw images inside grid cells
    items.forEach((item, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);
        // Calculate cell top-left corner
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
        const isRotated90or270 = item.rotation % 180 !== 0;
        const effWidth = (isRotated90or270 ? item.originalHeight : item.originalWidth) * item.scale;
        const effHeight = (isRotated90or270 ? item.originalWidth : item.originalHeight) * item.scale;
        // Center image inside cell
        const drawX = cellX + (cellW - effWidth) / 2;
        const drawY = cellY + (cellH - effHeight) / 2;
        const rawDrawWidth = item.originalWidth * item.scale;
        const rawDrawHeight = item.originalHeight * item.scale;
        ctx.save();
        // Translate to center of image position
        ctx.translate(drawX + effWidth / 2, drawY + effHeight / 2);
        // Apply rotation
        if (item.rotation !== 0) {
            ctx.rotate((item.rotation * Math.PI) / 180);
        }
        // Apply flips
        const scaleX = item.flipH ? -1 : 1;
        const scaleY = item.flipV ? -1 : 1;
        ctx.scale(scaleX, scaleY);
        ctx.drawImage(item.element, -rawDrawWidth / 2, -rawDrawHeight / 2, rawDrawWidth, rawDrawHeight);
        ctx.restore();
    });
    return { width: canvas.width, height: canvas.height };
}
