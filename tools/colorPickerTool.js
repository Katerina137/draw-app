function ColorPickerTool() {
  this.name = "colorPicker";
  this.icon = "assets/colorwheel.png";

  // nothing to draw continuously
  this.draw = function () { };

  // when user selects this tool from the sidebar
  this.onSelect = function () {
    const panel = document.getElementById("colorWheelPanel");
    panel.style.display = "block";

    //wheel only once
    if (!window.colorWheelInitialized) {
      setupColorWheel();
      window.colorWheelInitialized = true;
    }
  };

}


