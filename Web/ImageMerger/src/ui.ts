import { CanvasSettings, ImageItem, LayoutMode, ExportFormat, SizeStandardization } from './types';
import { renderMergedCanvas } from './canvasRenderer';

export class ImageMergerApp {
  private items: ImageItem[] = [];
  private settings: CanvasSettings = {
    layoutMode: 'auto',
    customColumns: 3,
    spacing: 10,
    padding: 10,
    backgroundColor: 'transparent',
    exportFormat: 'image/png',
    exportQuality: 0.92,
    customWidthLimit: 0,
    sizeStandardization: 'outlierMax',
    allowAspectDistortion: false,
  };

  private zoomLevel: number = 1.0; // 1.0 = Fit screen / natural
  private canvas: HTMLCanvasElement;

  constructor() {
    this.canvas = document.getElementById('output-canvas') as HTMLCanvasElement;

    this.initEventListeners();
    this.renderCanvas();
  }

  private initEventListeners(): void {
    document.querySelectorAll('.panel-toggle').forEach((toggle) => {
      toggle.addEventListener('click', () => {
        const panel = toggle.closest('.panel');
        if (!panel) return;

        const isCollapsed = panel.classList.toggle('collapsed');
        toggle.setAttribute('aria-expanded', String(!isCollapsed));
      });
    });

    // 1. File Upload & Drag & Drop
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    const dropZone = document.getElementById('drop-zone') as HTMLElement;

    fileInput.addEventListener('change', (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        this.handleFiles(Array.from(files));
        fileInput.value = ''; // reset input
      }
    });

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        this.handleFiles(Array.from(e.dataTransfer.files));
      }
    });

    // 2. Layout Mode Buttons
    const layoutBtns = document.querySelectorAll('#layout-mode-group .segment-btn');
    const customColsGroup = document.getElementById('group-custom-cols') as HTMLElement;

    layoutBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        layoutBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const mode = btn.getAttribute('data-mode') as LayoutMode;
        this.settings.layoutMode = mode;

        if (mode === 'custom') {
          customColsGroup.style.display = 'block';
        } else {
          customColsGroup.style.display = 'none';
        }

        this.renderCanvas();
      });
    });

    // 3. Size Standardization Buttons (Prevent Crop)
    const standardBtns = document.querySelectorAll('#size-standardization-group .segment-btn');
    standardBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        standardBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const standard = btn.getAttribute('data-standard') as SizeStandardization;
        this.settings.sizeStandardization = standard;
        this.renderCanvas();
      });
    });

    // 4. Allow Aspect Ratio Distortion Checkbox
    const chkDistortion = document.getElementById('chk-allow-distortion') as HTMLInputElement;
    chkDistortion?.addEventListener('change', () => {
      this.settings.allowAspectDistortion = chkDistortion.checked;
      this.renderCanvas();
    });

    // Custom Columns Slider
    const colsInput = document.getElementById('input-cols') as HTMLInputElement;
    const colsVal = document.getElementById('val-cols') as HTMLElement;
    colsInput.addEventListener('input', () => {
      const val = parseInt(colsInput.value, 10);
      this.settings.customColumns = val;
      colsVal.textContent = `${val}개`;
      this.renderCanvas();
    });

    // Spacing Slider
    const spacingInput = document.getElementById('input-spacing') as HTMLInputElement;
    const spacingVal = document.getElementById('val-spacing') as HTMLElement;
    spacingInput.addEventListener('input', () => {
      const val = parseInt(spacingInput.value, 10);
      this.settings.spacing = val;
      spacingVal.textContent = `${val} px`;
      this.renderCanvas();
    });

    // Padding Slider
    const paddingInput = document.getElementById('input-padding') as HTMLInputElement;
    const paddingVal = document.getElementById('val-padding') as HTMLElement;
    paddingInput.addEventListener('input', () => {
      const val = parseInt(paddingInput.value, 10);
      this.settings.padding = val;
      paddingVal.textContent = `${val} px`;
      this.renderCanvas();
    });

    // Background Color Presets & Picker
    const colorPresetBtns = document.querySelectorAll('.color-preset-btn');
    const customColorInput = document.getElementById('input-bg-color') as HTMLInputElement;

    colorPresetBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        colorPresetBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const color = btn.getAttribute('data-color') || 'transparent';
        this.settings.backgroundColor = color;
        this.renderCanvas();
      });
    });

    customColorInput.addEventListener('input', () => {
      colorPresetBtns.forEach((b) => b.classList.remove('active'));
      this.settings.backgroundColor = customColorInput.value;
      this.renderCanvas();
    });

    // Export Format & Quality
    const selectFormat = document.getElementById('select-format') as HTMLSelectElement;
    const qualityGroup = document.getElementById('group-quality') as HTMLElement;
    const qualityInput = document.getElementById('input-quality') as HTMLInputElement;
    const qualityVal = document.getElementById('val-quality') as HTMLElement;

    selectFormat.addEventListener('change', () => {
      const format = selectFormat.value as ExportFormat;
      this.settings.exportFormat = format;

      if (format === 'image/jpeg' || format === 'image/webp') {
        qualityGroup.style.display = 'block';
      } else {
        qualityGroup.style.display = 'none';
      }
    });

    qualityInput.addEventListener('input', () => {
      const val = parseInt(qualityInput.value, 10);
      this.settings.exportQuality = val / 100;
      qualityVal.textContent = `${val}%`;
    });

    // Action Buttons
    const btnDownloadTop = document.getElementById('btn-download-top');
    const btnDownloadSide = document.getElementById('btn-download-side');
    const btnCopyClipboard = document.getElementById('btn-copy-clipboard');
    const btnClearAll = document.getElementById('btn-clear-all');

    btnDownloadTop?.addEventListener('click', () => this.downloadCanvas());
    btnDownloadSide?.addEventListener('click', () => this.downloadCanvas());
    btnCopyClipboard?.addEventListener('click', () => this.copyToClipboard());
    btnClearAll?.addEventListener('click', () => this.clearAll());

    // Zoom Controls
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');
    const btnZoomFit = document.getElementById('btn-zoom-fit');

    btnZoomIn?.addEventListener('click', () => this.changeZoom(0.15));
    btnZoomOut?.addEventListener('click', () => this.changeZoom(-0.15));
    btnZoomFit?.addEventListener('click', () => this.resetZoom());
  }

  private handleFiles(files: File[]): void {
    const validFiles = files.filter((f) => f.type.startsWith('image/'));

    if (validFiles.length === 0) {
      this.showToast('올바른 이미지 파일을 선택해주세요.', 'error');
      return;
    }

    let loadedCount = 0;
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const item: ImageItem = {
            id: 'img_' + Math.random().toString(36).substr(2, 9),
            name: file.name,
            element: img,
            originalWidth: img.naturalWidth || img.width,
            originalHeight: img.naturalHeight || img.height,
            scale: 1.0,
            flipH: false,
            flipV: false,
            rotation: 0,
          };
          this.items.push(item);
          loadedCount++;

          if (loadedCount === validFiles.length) {
            this.renderItemList();
            this.renderCanvas();
            this.showToast(`${loadedCount}개의 이미지가 추가되었습니다.`, 'success');
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  private renderItemList(): void {
    const itemsListContainer = document.getElementById('items-list') as HTMLElement;
    const countBadge = document.getElementById('items-count-badge') as HTMLElement;

    countBadge.textContent = `${this.items.length}개`;

    if (this.items.length === 0) {
      itemsListContainer.innerHTML = `
        <div class="empty-list-message">
          <p>업로드된 이미지가 없습니다.</p>
        </div>
      `;
      return;
    }

    itemsListContainer.innerHTML = '';

    this.items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'item-card';
      card.setAttribute('draggable', 'true');
      card.dataset.id = item.id;
      card.dataset.index = String(index);

      card.innerHTML = `
        <div class="item-header">
          <div class="item-info">
            <span class="drag-handle" title="드래그하여 순서 변경">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
            </span>
            <img src="${item.element.src}" class="item-thumb" alt="${item.name}" />
            <span class="item-name" title="${item.name}">${index + 1}. ${item.name}</span>
          </div>

          <div class="item-actions">
            <button type="button" class="action-icon-btn ${item.flipH ? 'active' : ''}" data-action="fliph" title="좌우 수평 반전">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 7 5 5-5 5V7z"/><path d="m21 7-5 5 5 5V7z"/><line x1="12" x2="12" y1="4" y2="20"/></svg>
            </button>
            <button type="button" class="action-icon-btn ${item.flipV ? 'active' : ''}" data-action="flipv" title="상하 수직 반전">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7 3 5 5 5-5H7z"/><path d="m7 21 5-5 5 5H7z"/><line x1="4" x2="20" y1="12" y2="12"/></svg>
            </button>
            <button type="button" class="action-icon-btn" data-action="rotate" title="90° 회전">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
            </button>
            <button type="button" class="action-icon-btn" data-action="up" title="위로 이동" ${index === 0 ? 'disabled style="opacity:0.3"' : ''}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
            </button>
            <button type="button" class="action-icon-btn" data-action="down" title="아래로 이동" ${index === this.items.length - 1 ? 'disabled style="opacity:0.3"' : ''}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <button type="button" class="action-icon-btn danger" data-action="delete" title="이미지 삭제">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div class="item-controls-row">
          <span class="scale-label">배율: ${item.scale.toFixed(2)}배</span>
          <input type="range" class="range-input scale-slider" min="0.2" max="2.0" step="0.05" value="${item.scale}" data-id="${item.id}" />
        </div>
      `;

      // Event Listeners for Item Controls
      const scaleSlider = card.querySelector('.scale-slider') as HTMLInputElement;
      scaleSlider.addEventListener('input', (e) => {
        const val = parseFloat((e.target as HTMLInputElement).value);
        item.scale = val;
        const label = card.querySelector('.scale-label') as HTMLElement;
        if (label) label.textContent = `배율: ${val.toFixed(2)}배`;
        this.renderCanvas();
      });

      card.querySelectorAll('.action-icon-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const action = btn.getAttribute('data-action');
          if (action === 'fliph') {
            item.flipH = !item.flipH;
            this.renderItemList();
            this.renderCanvas();
          } else if (action === 'flipv') {
            item.flipV = !item.flipV;
            this.renderItemList();
            this.renderCanvas();
          } else if (action === 'rotate') {
            item.rotation = (item.rotation + 90) % 360;
            this.renderItemList();
            this.renderCanvas();
          } else if (action === 'up' && index > 0) {
            const temp = this.items[index];
            this.items[index] = this.items[index - 1];
            this.items[index - 1] = temp;
            this.renderItemList();
            this.renderCanvas();
          } else if (action === 'down' && index < this.items.length - 1) {
            const temp = this.items[index];
            this.items[index] = this.items[index + 1];
            this.items[index + 1] = temp;
            this.renderItemList();
            this.renderCanvas();
          } else if (action === 'delete') {
            this.items.splice(index, 1);
            this.renderItemList();
            this.renderCanvas();
          }
        });
      });

      // Item Drag and Drop reordering
      card.addEventListener('dragstart', (e) => {
        card.classList.add('dragging');
        if (e.dataTransfer) {
          e.dataTransfer.setData('text/plain', String(index));
        }
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
      });

      card.addEventListener('dragover', (e) => {
        e.preventDefault();
      });

      card.addEventListener('drop', (e) => {
        e.preventDefault();
        const fromIndexStr = e.dataTransfer?.getData('text/plain');
        if (fromIndexStr !== undefined) {
          const fromIndex = parseInt(fromIndexStr, 10);
          const toIndex = index;
          if (fromIndex !== toIndex && !isNaN(fromIndex)) {
            const movedItem = this.items.splice(fromIndex, 1)[0];
            this.items.splice(toIndex, 0, movedItem);
            this.renderItemList();
            this.renderCanvas();
          }
        }
      });

      itemsListContainer.appendChild(card);
    });
  }

  private renderCanvas(): void {
    const { width, height } = renderMergedCanvas(this.canvas, this.items, this.settings);

    // Update Dimensions and Aspect Ratio text
    const dimensionsVal = document.getElementById('val-dimensions');
    const aspectVal = document.getElementById('val-aspect');

    if (dimensionsVal) dimensionsVal.textContent = `${width} x ${height} px`;
    if (aspectVal) {
      const gcdVal = this.gcd(width, height);
      const aspectW = gcdVal ? Math.round(width / gcdVal) : 0;
      const aspectH = gcdVal ? Math.round(height / gcdVal) : 0;
      aspectVal.textContent = width > 0 ? `${aspectW}:${aspectH}` : '0:0';
    }

    this.applyZoom();
  }

  private gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  private changeZoom(delta: number): void {
    this.zoomLevel = Math.min(3.0, Math.max(0.2, this.zoomLevel + delta));
    this.applyZoom();
  }

  private resetZoom(): void {
    this.zoomLevel = 1.0;
    this.applyZoom();
  }

  private applyZoom(): void {
    const zoomVal = document.getElementById('val-zoom');
    const canvasWrapper = this.canvas.parentElement as HTMLElement;

    if (this.zoomLevel === 1.0) {
      if (zoomVal) zoomVal.textContent = '자동 맞춤';
      canvasWrapper.style.transform = 'scale(1.0)';
      this.canvas.style.maxWidth = '100%';
      this.canvas.style.maxHeight = '78vh';
      this.canvas.style.height = 'auto';
      this.canvas.style.width = 'auto';
    } else {
      const percent = Math.round(this.zoomLevel * 100);
      if (zoomVal) zoomVal.textContent = `${percent}%`;
      this.canvas.style.maxWidth = 'none';
      this.canvas.style.maxHeight = 'none';
      this.canvas.style.width = `${Math.round(this.canvas.width * this.zoomLevel)}px`;
      this.canvas.style.height = `${Math.round(this.canvas.height * this.zoomLevel)}px`;
      canvasWrapper.style.transform = 'none';
    }
  }

  private downloadCanvas(): void {
    if (this.items.length === 0) {
      this.showToast('다운로드할 이미지를 1개 이상 추가해주세요.', 'error');
      return;
    }

    const filenameInput = document.getElementById('input-filename') as HTMLInputElement;
    const name = (filenameInput?.value || 'merged-image').trim();
    const ext = this.settings.exportFormat.split('/')[1] || 'png';
    const filename = name.endsWith(`.${ext}`) ? name : `${name}.${ext}`;

    const dataUrl = this.canvas.toDataURL(this.settings.exportFormat, this.settings.exportQuality);

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showToast(`이미지 다운로드 시작: ${filename}`, 'success');
  }

  private async copyToClipboard(): Promise<void> {
    if (this.items.length === 0) {
      this.showToast('클립보드에 복사할 이미지를 1개 이상 추가해주세요.', 'error');
      return;
    }

    try {
      this.canvas.toBlob(async (blob) => {
        if (!blob) {
          this.showToast('이미지 생성에 실패했습니다.', 'error');
          return;
        }

        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              [blob.type]: blob,
            }),
          ]);
          this.showToast('병합된 이미지가 클립보드에 복사되었습니다!', 'success');
        } catch (err) {
          console.error(err);
          this.showToast('클립보드 복사 실패. 다운로드 기능을 이용해주세요.', 'error');
        }
      }, 'image/png');
    } catch (e) {
      console.error(e);
      this.showToast('현재 브라우저에서 클립보드 복사 기능을 지원하지 않습니다.', 'error');
    }
  }

  private clearAll(): void {
    if (this.items.length === 0) return;

    if (confirm('업로드된 모든 이미지를 삭제하시겠습니까?')) {
      this.items = [];
      this.renderItemList();
      this.renderCanvas();
      this.showToast('모든 이미지가 삭제되었습니다.', 'success');
    }
  }

  private showToast(message: string, type: 'success' | 'error' = 'success'): void {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
      }, 300);
    }, 3000);
  }
}
