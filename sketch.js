//global variables that will store the toolbox, colour palette and the helper functions
var toolbox = null;
var colourP = null;
var helpers = null;
var selectedColour = "#000000";
var undoStack = []; //array that will store canvas snapshot for undo
var redoStack = []; //array that will store canvas snapshot for redo 

function logStacks(where) {
  console.log(
    `[${where}] undo:${undoStack.length} redo:${redoStack.length}`
  );
}

function setupImageImporter() {
  const input = document.getElementById('importImageInput');
  if (!input) return;

  input.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
      loadImage(event.target.result, function (img) {
        // Draw the imported image at (0, 0), scaled to fit canvas
        image(img, 0, 0, width, height);
        loadPixels();
        if (helpers && helpers.pushState) {
          helpers.pushState();
        }
      }, function (err) {
        alert("Failed to load image.");
      });
    };
    reader.readAsDataURL(file);
  });
}

function setup() {

  //find page element with id content (div from index.html)
  canvasContainer = select('#content');
  //create a drawing canvas sized to the content div 
  var c = createCanvas(canvasContainer.size().width, canvasContainer.size().height);
  //attach the canvas inside the #content div 
  c.parent("content");

  //save the initial blank canvas into the undo stack. This gives undo something to go back to 
  undoStack.push(get());
  //create helper object so the buttons in the html get their event listeners
  //right at the start of the program before the user tries to click them 
  helpers = new HelperFunctions();
  //create color palette object so they appear as soon as the app starts
  colourP = new ColourPalette();

  //create a toolbox for storing the tools. It keeps the list of tools, shows
  //them in the sidebar and lets you switch 
  toolbox = new Toolbox();

  //add the tools to the toolbox.
  //make tool objects and register them with toolbox so they show up 
  //as icons and can be selected 
  toolbox.addTool(new FreehandTool());
  toolbox.addTool(new LineToTool());
  toolbox.addTool(new SprayCanTool());
  toolbox.addTool(new MirrorDrawTool());
  toolbox.addTool(new EraserTool());
  var stamp = new StampTool();
  stamp.preload();
  toolbox.addTool(stamp);
  toolbox.addTool(new ColorPickerTool());
  toolbox.addTool(new ShapeTool());
  toolbox.addTool(new PerspectiveTool());


  background(255); //makes the canvas white 

  setupColorWheel(); //initialize the color wheel (iro.js)

  setupImageImporter();

}

function mouseReleased() {

  const t = toolbox?.selectedTool;
  if (t && typeof t.onMouseReleased === "function") {
    // pass anything your tool might want (pressure/color optional)
    t.onMouseReleased({ color: selectedColour, pressure: 0.5 });
  }

  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    if (toolbox.selectedTool?.didStamp) {
      helpers.pushState();
      toolbox.selectedTool.didStamp = false;
      logStacks("stamp push");
    } else {
      helpers.pushState();
      logStacks("stroke push");
    }
  }
}

function mousePressed() {
  const t = toolbox?.selectedTool;
  if (t && typeof t.onMousePressed === "function") t.onMousePressed();
}

function mouseDragged() {
  const t = toolbox?.selectedTool;
  if (t && typeof t.onMouseDragged === "function") t.onMouseDragged();
}

function keyPressed() {
  // helpful log during testing
  console.log("key:", key, "keyCode:", keyCode);

  const t = toolbox?.selectedTool;
  if (t && typeof t.onKeyPressed === "function") {
    const handled = t.onKeyPressed(keyCode, key);
    if (handled) {
      if (typeof redraw === "function") redraw(); // important if you use noLoop()
      return false; // prevents page from scrolling on SPACE
    }
  }
}


function mouseWheel(event) {
  const t = toolbox?.selectedTool;
  if (t && typeof t.onWheel === "function") t.onWheel(event.delta);
}

function windowResized() {
  const container = select('#content');
  const w = container.size().width;
  const h = container.size().height;
  resizeCanvas(w, h);

  const t = toolbox?.selectedTool;
  if (t && typeof t.onResize === "function") t.onResize(w, h);
}




function draw() {
  // draw with the selected tool (if any)
  const tool = toolbox?.selectedTool;
  if (tool && tool.draw) {
    try { tool.draw(); } catch (e) { console.error('tool.draw error:', e); }
  }

}


