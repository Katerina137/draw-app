function SprayCanTool() {
  this.icon = "assets/sprayCan.png";
  this.name = "sprayCan";

  this.points = 15;   // dots per frame
  this.spread = 10;   // radius of spray

  
  this.onSelect = function () {
    const panel = document.querySelector(".options");
    if (!panel) return;

    panel.innerHTML = `
      <label for="sprayPoints">Points per frame:</label>
      <input type="range" id="sprayPoints" min="1" max="50" value="${this.points}">
      <br/>
      <label for="spraySpread">Spread radius:</label>
      <input type="range" id="spraySpread" min="1" max="100" value="${this.spread}">
    `;

    document.getElementById("sprayPoints")?.addEventListener("input", (e) => {
      this.points = parseInt(e.target.value);
    });
    document.getElementById("spraySpread")?.addEventListener("input", (e) => {
      this.spread = parseInt(e.target.value);
    });
  };

  this.onDeselect = function () {
    const panel = document.querySelector(".options");
    if (panel) panel.innerHTML = "";
  };

  //drawing 
  this.draw = function () {
    if (mouseIsPressed) {
      stroke(selectedColour);
      for (let i = 0; i < this.points; i++) {
        point(
          random(mouseX - this.spread, mouseX + this.spread),
          random(mouseY - this.spread, mouseY + this.spread)
        );
      }
    }
  };
}


