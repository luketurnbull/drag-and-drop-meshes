import { DragControls, Outlines } from "@react-three/drei";
import { useMeshStore } from "../store/mesh";
import { GEOMETRY_MAP } from "../utils/meshes";
import { DraggableMesh } from "../utils/types";
import { useState } from "react";

export default function Scene() {
  const meshes = useMeshStore((state) => state.meshes);

  return (
    <>
      {meshes.map(({ id, type, position }) => (
        <Mesh key={id} id={id} type={type} position={position} />
      ))}
    </>
  );
}

function Mesh({ id, type, position }: DraggableMesh) {
  const [hovered, setHovered] = useState(false);

  return (
    <DragControls
      key={id}
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
      <mesh geometry={GEOMETRY_MAP[type]} position={position}>
        <meshStandardMaterial color={hovered ? "blue" : "red"} />
        {hovered && <Outlines thickness={5} color="black" />}
      </mesh>
    </DragControls>
  );
}
