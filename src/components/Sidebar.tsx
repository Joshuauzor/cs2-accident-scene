import type { ChangeEvent } from "react";
import { ELEMENT_TYPES } from "../model/sceneModel";
import type { ElementType, SceneElement, SubType } from "../model/sceneModel";
import "./Sidebar.css";

const TYPE_ICONS: Record<ElementType, string> = {
  vehicle: "🚗",
  obstacle: "🔺",
  reference: "🌳",
};

interface Props {
  onAdd: (type: ElementType, sub: SubType) => void;
  selectedElement: SceneElement | null;
  onUpdateLabel: (label: string) => void;
  onDelete: () => void;
  onExport: () => void;
  onClear: () => void;
}

export default function Sidebar({
  onAdd,
  selectedElement,
  onUpdateLabel,
  onDelete,
  onExport,
  onClear,
}: Props) {
  const handleLabelChange = (e: ChangeEvent<HTMLInputElement>) =>
    onUpdateLabel(e.target.value);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo">⬡</span>
        <span className="sidebar-title">Scene Editor</span>
      </div>

      <section className="sidebar-section">
        <h3 className="sidebar-section-title">Add element</h3>
        {(Object.entries(ELEMENT_TYPES) as [ElementType, typeof ELEMENT_TYPES[ElementType]][]).map(
          ([type, def]) => (
            <div key={type} className="element-group">
              <p className="element-group-label">
                {TYPE_ICONS[type]} {def.label}
              </p>
              <div className="element-buttons">
                {def.subtypes.map((sub) => (
                  <button
                    key={sub.id}
                    className="element-btn"
                    type="button"
                    onClick={() => onAdd(type, sub)}
                    title={`Add ${sub.label}`}
                  >
                    <span className="element-dot" style={{ background: sub.color }} />
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>
          )
        )}
      </section>

      {selectedElement && (
        <section className="sidebar-section">
          <h3 className="sidebar-section-title">Selected element</h3>
          <div className="selected-card">
            <div className="selected-type">
              {TYPE_ICONS[selectedElement.type]} {selectedElement.properties.subtype}
            </div>
            <div className="field-inline">
              <label htmlFor="el-label">Label</label>
              <input
                id="el-label"
                type="text"
                value={selectedElement.properties.label}
                onChange={handleLabelChange}
              />
            </div>
            <div className="selected-coords">
              <span>x: {Math.round(selectedElement.x)}</span>
              <span>y: {Math.round(selectedElement.y)}</span>
              <span>∠ {Math.round(selectedElement.rotation)}°</span>
            </div>
            <button className="delete-btn" type="button" onClick={onDelete}>
              Remove element
            </button>
          </div>
        </section>
      )}

      <section className="sidebar-section sidebar-footer">
        <button className="export-btn" type="button" onClick={onExport}>
          Export JSON
        </button>
        <button className="clear-btn" type="button" onClick={onClear}>
          Clear scene
        </button>
      </section>
    </aside>
  );
}
