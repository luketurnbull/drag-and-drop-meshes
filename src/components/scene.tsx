import {
  GizmoHelper,
  GizmoViewport,
  Grid,
  Environment,
  CameraControls,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useMeshStore } from "../store/mesh";
import Mesh from "./mesh";
import * as THREE from "three";
import { useEffect, useCallback } from "react";
import { DraggableMesh } from "../utils/types";
import { getIntersectionPoint } from "../utils/raycaster";

export default function Scene({
  sectionRef,
  dragItem,
  controls,
}: {
  sectionRef: React.RefObject<HTMLDivElement>;
  dragItem: DraggableMesh | null;
  controls: CameraControls;
}) {
  const meshes = useMeshStore((state) => state.meshes);
  const addMesh = useMeshStore((state) => state.addMesh);
  const selectedMeshId = useMeshStore((state) => state.selectedMeshId);

  const { camera, raycaster, gl } = useThree();

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();

      if (!sectionRef.current || !dragItem) return;

      const point = getIntersectionPoint(e, camera, raycaster, gl.domElement);

      if (point) {
        addMesh({
          position: point,
          parts: dragItem.parts,
          scale: dragItem.scale,
        });
      }
    },
    [dragItem, camera, raycaster, gl.domElement, addMesh]
  );

  useEffect(() => {
    const element = sectionRef.current;
    if (element) {
      element.addEventListener("drop", handleDrop);
    }

    return () => {
      if (element) {
        element.removeEventListener("drop", handleDrop);
      }
    };
  }, [sectionRef, handleDrop]);

  return (
    <>
      {meshes.map((mesh) => (
        <Mesh key={mesh.id} mesh={mesh} controls={controls} />
      ))}

      {selectedMeshId === null && (
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
      )}

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
