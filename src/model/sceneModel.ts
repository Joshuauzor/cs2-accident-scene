// ─── Element types ──────────────────────────────────────────────────────────

export type ElementType = "vehicle" | "obstacle" | "reference";

export interface SubType {
  id: string;
  label: string;
  color: string;
}

export interface ElementTypeDef {
  label: string;
  subtypes: SubType[];
}

export const ELEMENT_TYPES: Record<ElementType, ElementTypeDef> = {
  vehicle: {
    label: "Vehicle",
    subtypes: [
      { id: "car", label: "Car", color: "#4f8ef7" },
      { id: "truck", label: "Truck", color: "#f7844f" },
      { id: "motorcycle", label: "Motorcycle", color: "#a84ff7" },
      { id: "bicycle", label: "Bicycle", color: "#4ff7a8" },
    ],
  },
  obstacle: {
    label: "Obstacle",
    subtypes: [
      { id: "cone", label: "Cone", color: "#f7c14f" },
      { id: "barrier", label: "Barrier", color: "#f74f4f" },
      { id: "debris", label: "Debris", color: "#888888" },
    ],
  },
  reference: {
    label: "Reference",
    subtypes: [
      { id: "tree", label: "Tree", color: "#3ab84a" },
      { id: "road-sign", label: "Road sign", color: "#ffffff" },
      { id: "building", label: "Building", color: "#8899aa" },
      { id: "intersection", label: "Intersection", color: "#555555" },
    ],
  },
};

// ─── Scene element ───────────────────────────────────────────────────────────

export interface ElementProperties {
  label: string;
  color: string;
  subtype: string;
}

export interface SceneElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  rotation: number;
  properties: ElementProperties;
}

// ─── Scene document ──────────────────────────────────────────────────────────

export interface Scene {
  version: "1.0";
  createdAt: string;
  elements: SceneElement[];
}

export function buildScene(elements: SceneElement[]): Scene {
  return {
    version: "1.0",
    createdAt: new Date().toISOString(),
    elements,
  };
}

// ─── Partial update applied on drag / transform end ─────────────────────────

export type ElementPatch = Partial<Pick<SceneElement, "x" | "y" | "rotation">>;
