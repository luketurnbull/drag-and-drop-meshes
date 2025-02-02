import { DragControls, Outlines } from "@react-three/drei";
import { useState } from "react";
import { DraggableMesh } from "../utils/types";

export default function Mesh({ id, type, position, geometry }: DraggableMesh) {
  const [hovered, setHovered] = useState(false);

  return (
    <DragControls
      key={id}
      autoTransform
      onHover={(hovered) => {
        setHovered(hovered);
        document.body.style.cursor = hovered ? "pointer" : "default";
      }}
      onDrag={() => {
        document.body.style.cursor = "grabbing";
      }}
      onDragEnd={() => {
        document.body.style.cursor = "pointer";
      }}
    >
      <mesh geometry={geometry} position={position}>
        <meshStandardMaterial color={hovered ? "blue" : "red"} />
        {hovered && <Outlines thickness={5} color="black" />}
      </mesh>
    </DragControls>
  );
}
