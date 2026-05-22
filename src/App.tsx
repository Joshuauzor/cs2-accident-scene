import { useState, useRef, useCallback } from "react";
import { Stage, Layer, Line } from "react-konva";
import type Konva from "konva";
import { v4 as uuidv4 } from "uuid";
import Sidebar from "./components/Sidebar";
import { SceneElementShape } from "./components/SceneElementShape";
import JsonModal from "./components/JsonModal";
import { buildScene } from "./model/sceneModel";
import type { SceneElement, ElementType, SubType, ElementPatch } from "./model/sceneModel";
import "./App.css";

const CANVAS_W = window.innerWidth - 240;
const CANVAS_H = window.innerHeight;
const GRID = 40;

function GridLines() {
  const vLines = Array.from({ length: Math.ceil(CANVAS_W / GRID) }, (_, i) => (
    <Line
      key={`v${i}`}
      points={[i * GRID, 0, i * GRID, CANVAS_H]}
      stroke="#1e1e28"
      strokeWidth={0.5}
    />
  ));
  const hLines = Array.from({ length: Math.ceil(CANVAS_H / GRID) }, (_, i) => (
    <Line
      key={`h${i}`}
      points={[0, i * GRID, CANVAS_W, i * GRID]}
      stroke="#1e1e28"
      strokeWidth={0.5}
    />
  ));
  return <>{vLines}{hLines}</>;
}

export default function App() {
  const [elements, setElements] = useState<SceneElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showJson, setShowJson] = useState<boolean>(false);
  const stageRef = useRef<Konva.Stage>(null);

  const selectedElement = elements.find((el) => el.id === selectedId) ?? null;

  const addElement = useCallback((type: ElementType, sub: SubType) => {
    const el: SceneElement = {
      id: uuidv4(),
      type,
      x: CANVAS_W / 2 + (Math.random() - 0.5) * 120,
      y: CANVAS_H / 2 + (Math.random() - 0.5) * 80,
      rotation: 0,
      properties: {
        label: sub.label,
        color: sub.color,
        subtype: sub.id,
      },
    };
    setElements((prev) => [...prev, el]);
    setSelectedId(el.id);
  }, []);

  const updateElement = useCallback((id: string, patch: ElementPatch) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...patch } : el))
    );
  }, []);

  const updateLabel = useCallback(
    (label: string) => {
      if (!selectedId) return;
      setElements((prev) =>
        prev.map((el) =>
          el.id === selectedId
            ? { ...el, properties: { ...el.properties, label } }
            : el
        )
      );
    },
    [selectedId]
  );

  const deleteSelected = useCallback(() => {
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  }, [selectedId]);

  const handleStageClick = (e: Konva.KonvaEventObject<Event>) => {
    if (e.target === e.target.getStage()) setSelectedId(null);
  };

  const jsonString = JSON.stringify(buildScene(elements), null, 2);

  return (
    <div className="app-root">
      <Sidebar
        onAdd={addElement}
        selectedElement={selectedElement}
        onUpdateLabel={updateLabel}
        onDelete={deleteSelected}
        onExport={() => setShowJson(true)}
        onClear={() => { setElements([]); setSelectedId(null); }}
      />

      <div className="canvas-area">
        <Stage
          ref={stageRef}
          width={CANVAS_W}
          height={CANVAS_H}
          style={{ background: "#0c0c0e" }}
          onClick={handleStageClick}
          onTap={handleStageClick}
        >
          <Layer><GridLines /></Layer>
          <Layer>
            {elements.map((el) => (
              <SceneElementShape
                key={el.id}
                el={el}
                isSelected={el.id === selectedId}
                onSelect={() => setSelectedId(el.id)}
                onChange={(patch) => updateElement(el.id, patch)}
              />
            ))}
          </Layer>
        </Stage>

        {elements.length === 0 && (
          <div className="canvas-hint">
            Add elements from the sidebar to start building your scene
          </div>
        )}
      </div>

      {showJson && (
        <JsonModal json={jsonString} onClose={() => setShowJson(false)} />
      )}
    </div>
  );
}
