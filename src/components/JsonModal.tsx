import type { MouseEvent } from "react";
import "./JsonModal.css";

interface Props {
  json: string;
  onClose: () => void;
}

export default function JsonModal({ json, onClose }: Props) {
  const handleOverlay = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleCopy = () => {
    void navigator.clipboard.writeText(json);
  };

  const handleDownload = () => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scene-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="json-overlay" onClick={handleOverlay}>
      <div className="json-modal" role="dialog" aria-modal="true" aria-label="Scene JSON export">
        <div className="json-header">
          <h2>Scene JSON</h2>
          <button className="json-close" type="button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <pre className="json-body">{json}</pre>
        <div className="json-footer">
          <button className="json-btn-secondary" type="button" onClick={handleCopy}>
            Copy
          </button>
          <button className="json-btn-primary" type="button" onClick={handleDownload}>
            Download .json
          </button>
        </div>
      </div>
    </div>
  );
}
