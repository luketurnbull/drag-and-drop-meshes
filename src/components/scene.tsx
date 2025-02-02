import {
  Environment,
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
} from "@react-three/drei";
import { useMeshStore } from "../store/mesh";
import Mesh from "./mesh";
import * as THREE from "three";

export default function Scene() {
  const meshes = useMeshStore((state) => state.meshes);

  return (
    <>
      {meshes.map(({ id, type, position, geometry }) => (
        <Mesh
          key={id}
          id={id}
          type={type}
          position={position}
          geometry={geometry}
        />
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
