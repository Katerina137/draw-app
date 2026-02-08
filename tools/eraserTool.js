function EraserTool() {
  this.icon = "assets/eraser.png";
  this.name = "eraser";
  this.size = 20; // default size

  // Called when the tool becomes active
  this.onSelect = function () {
    const panel = document.querySelector(".options");
    if (panel) {
      panel.innerHTML = `
        <label for="eraserSizeSlider">Eraser Size:</label>
        <input type="range" id="eraserSizeSlider" min="10" max="100" value="${this.size}">
      `;

      // keep slider synced with this.size
      const slider = document.getElementById("eraserSizeSlider");
      slider?.addEventListener("input", (e) => {
        this.size = parseInt(e.target.value);
      });
    }
  };

  // Called when user switches away
  this.onDeselect = function () {
    const panel = document.querySelector(".options");
    if (panel) panel.innerHTML = "";
  };

  // Drawing behaviour
  this.draw = function () {
    if (mouseIsPressed) {
      const sizeInput = document.getElementById("eraserSizeSlider");
      const size = sizeInput ? parseInt(sizeInput.value) : this.size;

      push();
      erase();
      noStroke();
      circle(mouseX, mouseY, size);
      noErase();
      pop();
    }
  };
}


