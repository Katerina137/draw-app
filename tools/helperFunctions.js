function HelperFunctions() {
  // --- DOM helpers (prefer vanilla; fall back to p5.select if needed) ---
  const $ = (id) => document.getElementById(id) || select('#' + id)?.elt;

  const clearBtn = $('clearButton');
  const saveBtn = $('saveImageButton');
  const undoBtn = $('undoButton');
  const redoBtn = $('redoButton');


  this.pushState = function () {
    // capture current canvas; reset redo
    undoStack.push(get());
    redoStack.length = 0;
  };

  this.clearCanvas = function () {
    this.pushState();
    background(255);
    loadPixels();
  };

  this.saveImage = function () {
    const exportFormat = document.getElementById('exportFormat')?.value || 'png';
    const extension = exportFormat === 'jpeg' ? 'jpg' : exportFormat;
    // saveCanvas can take a filename and extension
    saveCanvas('my_drawing', extension)
  };

  this.undo = function () {
    // need at least 2 states: current + something to go back to
    if (undoStack.length > 1) {
      // push current frame to redo
      redoStack.push(get());

      // show the previous snapshot
      const prev = undoStack[undoStack.length - 2];
      // drop the current snapshot
      undoStack.pop();

      image(prev, 0, 0);
      loadPixels();
    }
  };

  this.redo = function () {
    if (redoStack.length > 0) {
      // save current for a future undo
      undoStack.push(get());

      const next = redoStack.pop();
      image(next, 0, 0);
      loadPixels();
    }
  };

  clearBtn?.addEventListener('click', () => this.clearCanvas());
  saveBtn?.addEventListener('click', () => this.saveImage());
  undoBtn?.addEventListener('click', () => this.undo());
  redoBtn?.addEventListener('click', () => this.redo());
}
