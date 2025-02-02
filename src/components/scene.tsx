import {
  DragControls,
  Environment,
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
  Outlines,
} from "@react-three/drei";
import { useMeshStore } from "../store/mesh";
import { GEOMETRY_MAP } from "../utils/meshes";
import { DraggableMesh } from "../utils/types";
import { useState } from "react";
import * as THREE from "three";

export default function Scene() {
  const meshes = useMeshStore((state) => state.meshes);

  return (
    <>
      {meshes.map(({ id, type, position }) => (
        <Mesh key={id} id={id} type={type} position={position} />
      ))}

      <Grid
        position={[0, -0.01, 0]}
        receiveShadow
        args={[10.5, 10.5]}
        infiniteGrid
        fadeDistance={50}
        fadeStrength={1}
        sectionSize={4}
        sectionThickness={1.5}
        cellSize={1}
        cellThickness={1}
        side={THREE.DoubleSide}
      />

      <OrbitControls makeDefault />
      <Environment preset="city" />
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport
          axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]}
          labelColor="white"
        />
      </GizmoHelper>
    </>
  );
}

function Mesh({ id, type, position }: DraggableMesh) {
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
      <mesh geometry={GEOMETRY_MAP[type]} position={position}>
        <meshStandardMaterial color={hovered ? "blue" : "red"} />
        {hovered && <Outlines thickness={5} color="black" />}
      </mesh>
    </DragControls>
  );
}
