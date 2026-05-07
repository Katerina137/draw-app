# DrawApp 🎨

A browser-based drawing application built with [p5.js](https://p5js.org/), featuring a rich set of creative tools, a colour palette, undo/redo history, and image import/export — all running entirely in the browser with no backend required.

---

## Features

| Tool | Description |
|---|---|
| ✏️ **Freehand** | Draw freely with your mouse |
| 📏 **Line** | Click-and-drag straight lines |
| 🌀 **Spray Can** | Soft spray effect with adjustable spread |
| 🪞 **Mirror Draw** | Symmetrical drawing across a central axis |
| 🧹 **Eraser** | Remove parts of your drawing |
| 🖼️ **Stamp** | Place decorative stamps on the canvas |
| 🎨 **Colour Picker** | Sample any colour from the canvas |
| 🔷 **Shape** | Draw geometric shapes |
| 📐 **Perspective** | Draw with perspective guidelines |

**Plus:**
- 🎨 Colour palette with preset swatches + interactive colour wheel
- ↩️ Undo / ↪️ Redo (full history)
- 💾 Export as PNG or JPEG
- 📂 Import an image onto the canvas
- Brush size slider per tool

---

## Getting Started

DrawApp runs entirely in the browser — no build step or install needed.

1. Clone the repository:
   ```bash
   git clone https://github.com/Katerina137/DrawApp.git
   cd DrawApp
   ```

2. Serve the files with any local server. For example, with VS Code:
   - Install the **Live Server** extension
   - Right-click `index.html` → **Open with Live Server**

   Or via Python:
   ```bash
   python3 -m http.server 5500
   ```

3. Open `http://localhost:5500` in your browser.

> **Note:** Opening `index.html` directly as a `file://` URL may cause issues loading assets. Always use a local server.

---

## Project Structure

```
DrawApp/
├── index.html              # App entry point
├── sketch.js               # p5.js setup, draw loop, event routing
├── toolbox.js              # Tool registry and sidebar rendering
├── helperFunctions.js      # Undo/redo, save, clear logic
├── style.css               # All styling
├── tools/                  # Individual tool implementations
│   ├── freehandTool.js
│   ├── lineToTool.js
│   ├── sprayCanTool.js
│   ├── mirrorDrawTool.js
│   ├── eraserTool.js
│   ├── stampTool.js
│   ├── colorPickerTool.js
│   ├── shapeTool.js
│   ├── perspectiveTool.js
│   ├── colourPalette.js
│   └── colorWheel.js
├── assets/                 # Stamp images and tool icons
└── lib/                    # p5.js library files
```

---

## Adding Your Own Tool

Each tool is a constructor function exposing a standard interface:

```js
function MyTool() {
  this.name = "myTool";
  this.icon = "assets/myTool.png";

  this.draw = function () { /* called every frame */ };
  this.onSelect = function () { /* called when tool is activated */ };
  this.onDeselect = function () { /* cleanup when switching away */ };
  this.populateOptions = function () { /* fill the options panel */ };
}
```

Register it in `sketch.js`:
```js
toolbox.addTool(new MyTool());
```

---

## Built With

- [p5.js](https://p5js.org/) — creative coding library for canvas drawing
- [iro.js](https://iro.js.org/) — colour wheel component

---

## Author

Katerina — [@Katerina137](https://github.com/Katerina137)