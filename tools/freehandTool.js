function FreehandTool() {
  this.icon = "assets/freehand.png";
  this.name = "freehand";

  // internal state
  this.prev = null;        // {x, y} while dragging
  this.size = 2;           // optional: stroke weight
  this.showCursor = true;  // toggle if you use a custom cursor

  // Mount any UI when the tool is selected
  this.onSelect = function () {
    const panel = document.querySelector(".options");
    if (!panel) return;
    panel.innerHTML = `
      <label for="freehandSize">Brush Size:</label>
      <input type="range" id="freehandSize" min="1" max="50" value="${this.size}">
    `;
    const slider = document.getElementById("freehandSize");
    slider?.addEventListener("input", (e) => {
      this.size = parseInt(e.target.value);
    });

    if (this.showCursor) cursor('crosshair');
  };

  // Clean up when switching away
  this.onDeselect = function () {
    const panel = document.querySelector(".options");
    if (panel) panel.innerHTML = "";
    this.prev = null;
    cursor('default');
  };

  // Start stroke
  this.onMousePressed = function () {
    this.prev = { x: mouseX, y: mouseY };
  };

  // Continue stroke
  this.onMouseDragged = function () {
    if (!this.prev) return;
    stroke(selectedColour);
    strokeWeight(this.size);
    line(this.prev.x, this.prev.y, mouseX, mouseY);
    this.prev = { x: mouseX, y: mouseY };
  };

  // End stroke (global mouseReleased in sketch.js will push undo)
  this.onMouseReleased = function () {
    this.prev = null;
  };

  // No continuous drawing needed; keep empty
  this.draw = function () { };
}
