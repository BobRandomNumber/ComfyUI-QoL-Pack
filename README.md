# ComfyUI Quality of Life Pack

Some bug-fixed and optimized enhancements originally from [ComfyUI-Custom-Scripts](https://github.com/pythongosssss/ComfyUI-Custom-Scripts) by `pysssss`. This pack aims to incorporate updated enhancments without adding unnecessary features.

---

## Features

This package provides two key quality-of-life improvements:

### 1. Collapsible Nested Menus

Tired of scrolling through endless lists of checkpoints, LoRAs, or VAEs? This feature automatically organizes your model dropdowns into a clean, collapsible tree structure based on your folder layout.

-   Organizes long lists into a nested, foldable hierarchy.
-   Supports subfolder navigation directly in the menu.
-   Makes finding the right model quick and easy, especially for large collections.

### 2. Save Workflow as PNG

Adds a simple, one-click option to the canvas context menu to save your entire workflow as a single PNG image. The workflow data is embedded directly into the PNG file, making it easy to share, store, and reload your work.

-   Adds a `Save Workflow as PNG` option to the right-click menu on the canvas.
-   Embeds the full graph and node data into the image file.
-   Drag-and-drop the saved PNG back onto your ComfyUI canvas to instantly load the workflow.

## Screenshots

*(Note to BobRandomNumber: Please replace the placeholder URLs below with links to actual screenshots of the features in action. You can upload images directly to your GitHub repository and link to them.)*

**Nested Menus in Action:**
![A clear, organized dropdown menu showing models grouped into collapsible folders.](https://raw.githubusercontent.com/BobRandomNumber/ComfyUI-QoL-Pack/main/screenshots/nested_menus.png)

**Save Workflow Option:**
![The right-click context menu on the canvas showing the 'Save Workflow as PNG' option.](https://raw.githubusercontent.com/BobRandomNumber/ComfyUI-QoL-Pack/main/screenshots/save_workflow_option.png)

## Installation

1.  Navigate to your ComfyUI `custom_nodes` directory.

    ```bash
    cd ComfyUI/custom_nodes/
    ```
3.  Clone this repository into the `custom_nodes` folder.

    ```bash
    git clone https://github.com/BobRandomNumber/ComfyUI-QoL-Pack.git
    ```
5.  Restart ComfyUI.

## ⚠️ Important: Conflicts

This package contains modified versions of scripts found in `ComfyUI-Custom-Scripts` by `pysssss`.

**You should not have this pack and the original `ComfyUI-Custom-Scripts` by `pysssss` installed at the same time**, as they may conflict and cause issues with your menus.

Please choose one pack or the other. This `QoL-Pack` was created to provide a stable, minimal alternative.

## Credits and Attribution

This package would not be possible without the foundational work done by the original author. The features included here are heavily based on, and are a slimmed-down, refactored version of, scripts from the following repository:

-   **Original Project:** [ComfyUI-Custom-Scripts](https://github.com/pythongosssss/ComfyUI-Custom-Scripts)
-   **Original Author:** `pysssss` (pythongosssss)

Specifically, this pack modifies and builds upon:
-   `betterCombos.js`
-   `workflowImage.js`

Full credit goes to `pysssss` for creating these excellent utilities for the ComfyUI community.
