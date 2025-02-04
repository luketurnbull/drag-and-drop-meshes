import { CameraControls, useCursor } from "@react-three/drei";
import { useRef, useState, useCallback, useMemo, memo, useEffect } from "react";
import { DraggableMesh, MeshPart } from "../utils/types";
import { useMeshStore } from "../store/mesh";
import { Box3, Group } from "three";
import { ThreeEvent, useThree } from "@react-three/fiber";
import { getIntersectionPoint } from "../utils/raycaster";
import { setCameraState } from "../utils/camera";

export default function Mesh({
  mesh,
  controls,
}: {
  mesh: DraggableMesh;
  controls: CameraControls;
}) {
  const groupRef = useRef<Group>(null!);
  const editMesh = useMeshStore((state) => state.editMesh);
  const selectedMeshId = useMeshStore((state) => state.selectedMeshId);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const { camera, raycaster, gl } = useThree();
  const dragTimeout = useRef<number | null>(null);

  const isSelected = useMemo(
    () => selectedMeshId === mesh.id,
    [selectedMeshId, mesh.id]
  );

  const zoomToMesh = useCallback(() => {
    const boundingBox = new Box3().setFromObject(groupRef.current);
    controls.fitToBox(boundingBox, true).then(() => {
      setCameraState(controls, "editMode");
    });
  }, [controls]);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      if (hasDragged) {
        e.stopPropagation();
        return;
      }
      editMesh(mesh.id);
      zoomToMesh();
    },
    [editMesh, mesh.id, zoomToMesh, hasDragged]
  );

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setIsDragging(true);
      setHasDragged(false);
      document.body.style.cursor = "grabbing";
      controls.enabled = false;
    },
    [controls]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging || !groupRef.current) return;
      setHasDragged(true);

      const point = getIntersectionPoint(e, camera, raycaster, gl.domElement);

      if (point) {
        groupRef.current.position.x = point.x;
        groupRef.current.position.z = point.z;
      }
    },
    [isDragging, camera, raycaster, gl.domElement]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    document.body.style.cursor = "pointer";
    controls.enabled = true;

    // Reset hasDragged after a short delay
    if (dragTimeout.current) window.clearTimeout(dragTimeout.current);
    dragTimeout.current = window.setTimeout(() => {
      setHasDragged(false);
    }, 100);
  }, [isDragging, controls]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (dragTimeout.current) window.clearTimeout(dragTimeout.current);
    };
  }, []);

  // Add and remove window event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Don't render if not selected and we're in edit mode
  if (!isSelected && selectedMeshId !== null) return null;
  if (mesh.parts.length === 0) return null;

  if (isSelected) {
    return (
      <group position={mesh.position} scale={mesh.scale}>
        {mesh.parts.map((part) => (
          <Part key={part.name} part={part} />
        ))}
      </group>
    );
  }

  return (
    <group
      position={mesh.position}
      scale={mesh.scale}
      ref={groupRef}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
    >
      {mesh.parts.map((part) => (
        <Part key={part.name} part={part} />
      ))}
    </group>
  );
}

const Part = memo(({ part }: { part: MeshPart }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
  }, []);

  const handlePointerOut = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
  }, []);

  return (
    <mesh
      geometry={part.geometry}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <meshStandardMaterial color={0xcc0000} />
    </mesh>
  );
});
