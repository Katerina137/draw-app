var iroColorPicker;
var colorWheelVisible = false;
var colorWheelInitialized = false;

function setupColorWheel() {
    iroColorPicker = new iro.ColorPicker("#colorWheelContainer", {
        width: 200,
        color: "#f00",
    });

    iroColorPicker.on("color:change", function (color) {
        selectedColour = color.hexString;
    });

    colorWheelInitialized = true;
}

// DRAGGABLE FUNCTIONALITY
function makePanelDraggable(panel, handle) {
    var offsetX = 0, offsetY = 0, dragging = false;

    handle.addEventListener("mousedown", (e) => {
        dragging = true;
        offsetX = e.clientX - panel.offsetLeft;
        offsetY = e.clientY - panel.offsetTop;
        e.preventDefault();
    });

    document.addEventListener("mouseup", () => dragging = false);

    document.addEventListener("mousemove", (e) => {
        if (dragging) {
            panel.style.left = (e.clientX - offsetX) + "px";
            panel.style.top = (e.clientY - offsetY) + "px";
        }
    });
}

// Close button functionality
document.addEventListener("DOMContentLoaded", () => {
    var panel = document.getElementById("colorWheelPanel");
    var header = document.getElementById("colorWheelHeader");
    var closeBtn = document.getElementById("closeColorWheel");

    makePanelDraggable(panel, header);

    closeBtn.addEventListener("click", () => {
        panel.style.display = "none";
    });
});

