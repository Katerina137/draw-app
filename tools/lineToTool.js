function LineToTool() {
  this.icon = "assets/lineTo.png";
  this.name = "lineTo";

  let startX = -1;
  let startY = -1;
  let drawing = false;
  this.size = 2; // default line thickness

  // When tool is selected: show brush size option
  this.onSelect = function () {
    const panel = select(".options");
    if (!panel) return;

    panel.html(`
      <label for="lineSize">Line Size:</label>
      <input type="range" id="lineSize" min="1" max="50" value="${this.size}">
    `);

    const slider = select("#lineSize");
    slider.input(() => {
      this.size = parseInt(slider.value());
    });

    cursor('crosshair');
  };

  // When tool is deselected
  this.onDeselect = function () {
    const panel = select(".options");
    if (panel) panel.html("");
    cursor('default');
  };

  // On mouse press: mark start point
  this.onMousePressed = function () {
    startX = mouseX;
    startY = mouseY;
    drawing = true;
    loadPixels(); // save current canvas for preview
  };

  // While dragging: preview line
  this.onMouseDragged = function () {
    if (!drawing) return;
    updatePixels(); // restore canvas
    stroke(selectedColour);
    strokeWeight(this.size);
    line(startX, startY, mouseX, mouseY);
  };

  // On release: finalize line
  this.onMouseReleased = function () {
    if (!drawing) return;
    drawing = false;
    updatePixels(); // restore
    stroke(selectedColour);
    strokeWeight(this.size);
    line(startX, startY, mouseX, mouseY);
    startX = -1;
    startY = -1;
  };

  this.draw = function () { }; // nothing continuous
}
