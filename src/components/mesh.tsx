import { CameraControls, DragControls, useCursor } from "@react-three/drei";
import { useRef, useState, useCallback, useMemo, memo } from "react";
import { DraggableMesh, MeshPart } from "../utils/types";
import { useMeshStore } from "../store/mesh";
import { Box3, Group } from "three";
import { ThreeEvent } from "@react-three/fiber";
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

  const [isDragging, setIsDragging] = useState<boolean>(false);

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
      if (isSelected || isDragging) {
        e.stopPropagation();
        return;
      }
      editMesh(mesh.id);
      zoomToMesh();
    },
    [editMesh, mesh.id, zoomToMesh, isSelected, isDragging]
  );

  // Don't render if not selected and we're in edit mode
  if (!isSelected && selectedMeshId !== null) return null;
  if (mesh.parts.length === 0) return null;

  return (
    <DragControls
      onDrag={() => {
        setIsDragging(true);
      }}
      onDragEnd={() => {
        setTimeout(() => {
          setIsDragging(false);
        }, 100);
      }}
    >
      <group
        position={mesh.position}
        scale={mesh.scale}
        ref={groupRef}
        onClick={handleClick}
      >
        {mesh.parts.map((part) => (
          <Part key={part.name} part={part} />
        ))}
      </group>
    </DragControls>
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
