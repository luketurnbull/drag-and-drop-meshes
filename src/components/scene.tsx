import {
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
  Environment,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useMeshStore } from "../store/mesh";
import Mesh from "./mesh";
import * as THREE from "three";
import { useEffect, useCallback } from "react";
import { DraggableMesh } from "../utils/types";

export default function Scene({
  sectionRef,
  dragItem,
}: {
  sectionRef: React.RefObject<HTMLDivElement>;
  dragItem: DraggableMesh | null;
}) {
  const meshes = useMeshStore((state) => state.meshes);
  const addMesh = useMeshStore((state) => state.addMesh);
  const { camera, raycaster } = useThree();

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();

      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();

      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const mouse = new THREE.Vector2(x, y);

      raycaster.setFromCamera(mouse, camera);

      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const point = new THREE.Vector3();

      raycaster.ray.intersectPlane(plane, point);

      if (point && dragItem) {
        addMesh({
          type: dragItem.type,
          position: point,
          geometry: dragItem.geometry,
        });
      }
    },
    [dragItem, sectionRef, camera, raycaster, addMesh]
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
