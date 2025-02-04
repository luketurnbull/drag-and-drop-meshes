import { CameraControls, DragControls, useCursor } from "@react-three/drei";
import { useRef, useState, useCallback, useMemo, memo } from "react";
import { DraggableMesh, MeshPart } from "../utils/types";
import { useMeshStore } from "../store/mesh";
import { Box3, Group } from "three";
import { ThreeEvent } from "@react-three/fiber";
import { useCamera } from "../hooks/use-camera";

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
  const { setCameraState } = useCamera(controls);

  // Check if the mesh is selected
  const isSelected = useMemo(
    () => selectedMeshId === mesh.id,
    [selectedMeshId, mesh.id]
  );

  // Zoom to the mesh when it is selected
  const zoomToMesh = useCallback(() => {
    const boundingBox = new Box3().setFromObject(groupRef.current);
    controls.fitToBox(boundingBox, true).then(() => {
      setCameraState("editMode");
    });
  }, [controls, setCameraState]);

  // When the mesh is clicked, select it and zoom to it
  // Don't allow the mesh to be selected when dragging and when the mesh is already selected
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
      dragConfig={{
        // Disable drag controls when the mesh is selected
        enabled: !isSelected,
      }}
      onDrag={() => {
        // Prevent the mesh from being selected when dragging has started
        setIsDragging(true);
      }}
      onDragEnd={() => {
        // Prevent the mesh from being selected when dragging has ended
        // https://stackoverflow.com/questions/54067294/how-to-deactivate-dragcontrols-in-three-js
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
        {/* Render all parts of the model, so each part can be selected */}
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
