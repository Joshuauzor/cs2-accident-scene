# CS2 Accident Scene Editor

A browser-based accident scene diagram editor. Place vehicles, obstacles, and reference objects on a grid canvas, position and rotate them, then export the layout as structured JSON.

## Features

- **Canvas editor** — Konva-powered stage with a 40px grid background
- **Element library** — Vehicles (car, truck, motorcycle, bicycle), obstacles (cone, barrier, debris), and reference points (tree, road sign, building, intersection)
- **Interact on canvas** — Click to select, drag to move, use handles to rotate
- **Sidebar controls** — Edit labels, view coordinates, remove selected elements
- **Export** — Preview scene JSON, copy to clipboard, or download a `.json` file
- **Clear scene** — Reset the canvas in one action

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer (20+ recommended)
- npm (included with Node.js)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Open the URL printed in the terminal (typically `http://localhost:5173`).

### 3. Build for production

```bash
npm run build
```

Output is written to the `dist/` folder.

### 4. Preview the production build

```bash
npm run preview
```

Serves the `dist/` build locally for a quick smoke test before deployment.

## Available scripts


| Command           | Description                                       |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Start Vite dev server with hot reload             |
| `npm run build`   | Type-check (`tsc -b`) and create production build |
| `npm run preview` | Serve the production build locally                |
| `npm run lint`    | Run ESLint on the project                         |


## Usage guide

### Adding elements

1. Use the **Add element** section in the left sidebar.
2. Click a subtype button (e.g. **Car**, **Cone**, **Tree**).
3. The new element appears near the center of the canvas and is selected automatically.

### Selecting and editing

- **Select** — Click an element on the canvas.
- **Deselect** — Click empty canvas space (not on an element).
- **Move** — Drag the selected element.
- **Rotate** — Use the rotation handle on the transformer when selected.
- **Label** — Change the text in the **Label** field under **Selected element**.
- **Remove** — Click **Remove element** in the sidebar.

### Exporting the scene

1. Click **Export JSON** in the sidebar.
2. In the modal you can:
  - **Copy** — Copy the JSON to the clipboard
  - **Download .json** — Save a timestamped file (e.g. `scene-1716300000000.json`)
3. Close the modal with **✕** or by clicking outside it.

### Clearing the canvas

Click **Clear scene** to remove all elements and reset selection.

## Exported JSON format

Scenes are versioned documents produced by `buildScene()` in `src/model/sceneModel.ts`:

```json
{
  "version": "1.0",
  "createdAt": "2026-05-22T12:00:00.000Z",
  "elements": [
    {
      "id": "uuid",
      "type": "vehicle",
      "x": 400,
      "y": 300,
      "rotation": 45,
      "properties": {
        "label": "Car",
        "color": "#4f8ef7",
        "subtype": "car"
      }
    }
  ]
}
```


| Field       | Description                                                     |
| ----------- | --------------------------------------------------------------- |
| `version`   | Schema version (`"1.0"`)                                        |
| `createdAt` | ISO timestamp when export was generated                         |
| `elements`  | Array of placed objects with position, rotation, and properties |


## Project structure

```
src/
├── App.tsx                 # Main app: canvas stage, state, wiring
├── main.tsx                # React entry point
├── model/
│   └── sceneModel.ts       # Types, element catalog, scene builder
└── components/
    ├── Sidebar.tsx         # Add/edit/export UI
    ├── SceneElementShape.tsx  # Konva shapes + drag/transform
    └── JsonModal.tsx       # Export preview, copy, download
```

## Tech stack

- **React 19** + **TypeScript**
- **Vite** — dev server and bundler
- **Konva** / **react-konva** — 2D canvas rendering and interaction
- **uuid** — unique element IDs

