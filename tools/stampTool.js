function StampTool() {
  this.name = "stamp";
  this.icon = "assets/stamptool.png";

  this.stamps = {};
  this.currentStamp = "heart";
  this.size = 20;
  this.didStamp = false;   // used by your global mouseReleased() for pushState

  // load images before use (you already call stamp.preload() in setup)
  this.preload = function () {
    this.stamps["heart"]       = loadImage("assets/heartstamp.png");
    this.stamps["star"]        = loadImage("assets/starstamp.png");
    this.stamps["butterfly"]   = loadImage("assets/butterflystamp.png");
    this.stamps["butterflies"] = loadImage("assets/manybutterfliesstamp.png");
  };


  this.onSelect = function () {
    const panel = document.querySelector(".options");
    if (!panel) return;

    panel.innerHTML = `
      <label for="stampSelector">Choose Stamp:</label>
      <select id="stampSelector">
        <option value="heart">❤️ heart</option>
        <option value="star">⭐️ star</option>
        <option value="butterfly">🦋 butterfly</option>
        <option value="butterflies">🦋🦋🦋 butterflies</option>
      </select>

      <label for="stampSizeSlider">Stamp Size:</label>
      <input type="range" id="stampSizeSlider" min="20" max="300" value="${this.size}">
    `;

    const selector = document.getElementById("stampSelector");
    const sizeSl   = document.getElementById("stampSizeSlider");

    selector.value = this.currentStamp;
    selector.addEventListener("change", () => {
      this.currentStamp = selector.value;
    });

    sizeSl.addEventListener("input", (e) => {
      this.size = parseInt(e.target.value);
    });
  };

  this.onDeselect = function () {
    const panel = document.querySelector(".options");
    if (panel) panel.innerHTML = "";
  };

  this.onMousePressed = function () {
    // guard: must have an image and be inside canvas
    const img = this.stamps[this.currentStamp];
    if (!img) return;
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

    // read current size from slider if present
    const sizeEl = document.getElementById("stampSizeSlider");
    const size = sizeEl ? parseInt(sizeEl.value) : this.size;

    imageMode(CENTER);
    image(img, mouseX, mouseY, size, size);

    // signal to global mouseReleased() to push undo snapshot
    this.didStamp = true;
  };

  // don’t stamp repeatedly while held down; leave these empty
  this.onMouseDragged  = function () {};
  this.onMouseReleased = function () { /* nothing — global handler will pushState */ };

  // no continuous drawing needed
  this.draw = function () {};
}
