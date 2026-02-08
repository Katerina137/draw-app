// container object for storing the tools.
function Toolbox() {
  var self = this;

  this.tools = [];
  this.selectedTool = null;

  // helper: clear toolbar highlights
  function clearHighlights() {
    var items = selectAll(".sideBarItem");
    for (var i = 0; i < items.length; i++) {
      items[i].style('border', '0');
    }
  }

  // helper: set highlight on the active tool icon
  function highlight(name) {
    var el = select("#" + name + "sideBarItem");
    if (el) el.style("border", "2px solid blue");
  }

  // click handler for sidebar items
  var toolbarItemClick = function () {
    clearHighlights();
    var toolName = this.id().split("sideBarItem")[0];
    self.selectTool(toolName);

    // ensure pixel array is up to date after switching tools
    loadPixels();
  };

  // add a new tool icon to the html page
  var addToolIcon = function (icon, name) {
    var sideBarItem = createDiv("<img src='" + icon + "'>");
    sideBarItem.class('sideBarItem');
    sideBarItem.id(name + "sideBarItem");
    sideBarItem.parent('sidebar');
    sideBarItem.mouseClicked(toolbarItemClick);
  };

  // add a tool to the tools array and render its icon
  this.addTool = function (tool) {
    if (!tool.hasOwnProperty("icon") || !tool.hasOwnProperty("name")) {
      alert("make sure your tool has both a name and an icon");
      return;
    }
    this.tools.push(tool);
    addToolIcon(tool.icon, tool.name);

    // if no tool is selected yet, select the first one
    if (this.selectedTool == null) {
      this.selectTool(tool.name);
    }
  };

  // select a tool by its name
  this.selectTool = function (toolName) {
    for (var i = 0; i < this.tools.length; i++) {
      if (this.tools[i].name === toolName) {
        // 1) Deselect previous tool (new callback + legacy support)
        if (this.selectedTool) {
          try {
            if (typeof this.selectedTool.onDeselect === "function") {
              this.selectedTool.onDeselect();
            } else if (typeof this.selectedTool.unselectTool === "function") {
              // legacy name you used before
              this.selectedTool.unselectTool();
            }
          } catch (e) {
            console.error("onDeselect/unselectTool error:", e);
          }
        }

        // 2) Switch selected tool and highlight it in the toolbar
        this.selectedTool = this.tools[i];
        clearHighlights();
        highlight(toolName);

        // 3) Notify the new tool it was selected (new callback)
        try {
          if (typeof this.selectedTool.onSelect === "function") {
            this.selectedTool.onSelect();
          }
        } catch (e) {
          console.error("onSelect error:", e);
        }

        // 4) Populate options panel if the tool provides it (existing API)
        try {
          if (typeof this.selectedTool.populateOptions === "function") {
            this.selectedTool.populateOptions();
          }
        } catch (e) {
          console.error("populateOptions error:", e);
        }

        return; // done
      }
    }
    // If we reach here, tool name wasn't found
    console.warn("Tool not found:", toolName);
  };

  // optional convenience: select by index
  this.selectToolByIndex = function (index) {
    if (index >= 0 && index < this.tools.length) {
      this.selectTool(this.tools[index].name);
    }
  };

  // draw proxy (unchanged)
  this.draw = function () {
    if (this.selectedTool && typeof this.selectedTool.draw === "function") {
      this.selectedTool.draw();
    }
  };
}
