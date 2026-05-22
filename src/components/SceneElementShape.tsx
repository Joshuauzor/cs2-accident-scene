import { useRef, useEffect } from "react";
import { Group, Rect, Circle, RegularPolygon, Text, Transformer } from "react-konva";
import type Konva from "konva";
import type { SceneElement, ElementPatch } from "../model/sceneModel";

// ─── Sub-shapes ──────────────────────────────────────────────────────────────

interface ShapeProps {
  subtype: string;
  color: string;
}

function VehicleShape({ subtype, color }: ShapeProps) {
  const w =
    subtype === "truck" ? 54 : subtype === "motorcycle" || subtype === "bicycle" ? 18 : 40;
  const h =
    subtype === "truck" ? 28 : subtype === "motorcycle" ? 34 : subtype === "bicycle" ? 36 : 22;

  return (
    <>
      <Rect x={-w / 2} y={-h / 2} width={w} height={h} fill={color} cornerRadius={4} />
      {subtype === "car" && (
        <Rect
          x={-14}
          y={-h / 2 - 8}
          width={28}
          height={12}
          fill={color}
          opacity={0.7}
          cornerRadius={3}
        />
      )}
    </>
  );
}

function ObstacleShape({ subtype, color }: ShapeProps) {
  if (subtype === "cone") return <RegularPolygon sides={3} radius={16} fill={color} />;
  if (subtype === "barrier")
    return <Rect x={-24} y={-8} width={48} height={16} fill={color} cornerRadius={3} />;
  return <Circle radius={12} fill={color} />;
}

function ReferenceShape({ subtype, color }: ShapeProps) {
  if (subtype === "tree")
    return (
      <>
        <RegularPolygon sides={3} radius={22} fill={color} y={-6} />
        <Rect x={-4} y={10} width={8} height={14} fill="#7a5c3a" />
      </>
    );
  if (subtype === "road-sign")
    return (
      <>
        <RegularPolygon sides={8} radius={18} fill="#e63946" stroke={color} strokeWidth={2} />
        <Text text="STOP" fontSize={8} fill="white" x={-10} y={-5} width={20} align="center" />
      </>
    );
  if (subtype === "building")
    return <Rect x={-20} y={-28} width={40} height={56} fill={color} cornerRadius={2} />;
  // intersection
  return (
    <>
      <Rect x={-30} y={-2} width={60} height={4} fill={color} />
      <Rect x={-2} y={-30} width={4} height={60} fill={color} />
    </>
  );
}

// ─── Composed element shape ──────────────────────────────────────────────────

interface SceneElementShapeProps {
  el: SceneElement;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (patch: ElementPatch) => void;
}

export function SceneElementShape({
  el,
  isSelected,
  onSelect,
  onChange,
}: SceneElementShapeProps) {
  const shapeRef = useRef<Konva.Group>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    onChange({ x: e.target.x(), y: e.target.y() });
  };

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    if (!node) return;
    onChange({ x: node.x(), y: node.y(), rotation: node.rotation() });
  };

  const { type, properties } = el;

  return (
    <>
      <Group
        ref={shapeRef}
        x={el.x}
        y={el.y}
        rotation={el.rotation}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      >
        {type === "vehicle" && (
          <VehicleShape subtype={properties.subtype} color={properties.color} />
        )}
        {type === "obstacle" && (
          <ObstacleShape subtype={properties.subtype} color={properties.color} />
        )}
        {type === "reference" && (
          <ReferenceShape subtype={properties.subtype} color={properties.color} />
        )}
        <Text
          text={properties.label}
          fontSize={10}
          fill="rgba(255,255,255,0.85)"
          x={-30}
          y={24}
          width={60}
          align="center"
        />
      </Group>

      {isSelected && (
        <Transformer
          ref={trRef}
          enabledAnchors={["middle-left", "middle-right"]}
          rotateEnabled={true}
          boundBoxFunc={(_oldBox, newBox) => newBox}
        />
      )}
    </>
  );
}
