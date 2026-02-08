function ShapeTool() {
  this.name = "shapeTool";
  this.icon = "assets/shapetool.png";

  this.shapeType = "rectangle";
  let startX = -1, startY = -1;
  let drawing = false;

  this.onSelect = function () {
    const panel = document.querySelector(".options");
    if (!panel) return;

    panel.innerHTML = `
      <label for="shapeType">Shape:</label>
      <select id="shapeType">
        <option value="rectangle">rectangle</option>
        <option value="ellipse">ellipse</option>
        <option value="triangle">triangle</option>
        <option value="right triangle">right triangle</option>
      </select>
    `;
    const dd = document.getElementById("shapeType");
    dd.value = this.shapeType;
    dd.addEventListener("change", () => { this.shapeType = dd.value; });
  };

  this.onDeselect = function () {
    const panel = document.querySelector(".options");
    if (panel) panel.innerHTML = "";
  };

  this.onMousePressed = function () {
    startX = mouseX; startY = mouseY;
    drawing = true;
    loadPixels(); // save canvas for live preview
  };

  this.onMouseDragged = function () {
    if (!drawing) return;
    updatePixels();                // restore canvas
    stroke(selectedColour);
    fill(selectedColour);          // change to noFill() if you prefer outlines
    this.drawShape(startX, startY, mouseX, mouseY);
  };

  this.onMouseReleased = function () {
    if (!drawing) return;
    drawing = false;

    updatePixels();                // restore last committed state
    stroke(selectedColour);
    fill(selectedColour);
    this.drawShape(startX, startY, mouseX, mouseY);

    // reset
    startX = startY = -1;
    // (undo snapshot is taken by your global mouseReleased())
  };

  // No continuous work needed here
  this.draw = function () {};


  this.drawShape = function (x0, y0, x1, y1) {
    if (this.shapeType === "rectangle") {
      // Use corners for simpler dragging (works for any direction)
      push();
      rectMode(CORNERS);
      rect(x0, y0, x1, y1);
      pop();
    } else if (this.shapeType === "ellipse") {
      const cx = (x0 + x1) / 2;
      const cy = (y0 + y1) / 2;
      const w = Math.abs(x1 - x0);
      const h = Math.abs(y1 - y0);
      ellipse(cx, cy, w, h);
    } else if (this.shapeType === "triangle") {
      // isosceles: base from (x0,y0) to (x1,y0), apex at midpoint x, y1
      triangle(x0, y0, x1, y0, (x0 + x1) / 2, y1);
    } else if (this.shapeType === "right triangle") {
      // right angle at (x0, y1)
      triangle(x0, y0, x0, y1, x1, y1);
    }
  };
}
