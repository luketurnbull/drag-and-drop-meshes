import { CameraControls, DragControls, useCursor } from "@react-three/drei";
import { useRef, useState, useCallback, useMemo } from "react";
import { DraggableMesh, MeshPart } from "../utils/types";
import { useMeshStore } from "../store/mesh";
import { Box3, Group, MeshStandardMaterialParameters, Vector3 } from "three";
import { ThreeEvent } from "@react-three/fiber";
import { useCamera } from "../hooks/use-camera";
import { useTextures } from "../hooks/use-textures";

export default function Mesh({
  mesh,
  controls,
}: {
  mesh: DraggableMesh;
  controls: CameraControls;
}) {
  const groupRef = useRef<Group>(null!);
  const editMesh = useMeshStore((state) => state.editMesh);
  const updateMeshPosition = useMeshStore((state) => state.updateMeshPosition);
  const selectedMeshId = useMeshStore((state) => state.selectedMeshId);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [localPosition, setLocalPosition] = useState<Vector3>(mesh.position);
  const { setCameraState } = useCamera(controls);

  // Store the initial position when starting to drag
  const dragStartPosition = useRef<Vector3 | null>(null);

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
      autoTransform={false}
      dragConfig={{
        // Disable drag controls when the mesh is selected
        enabled: !isSelected,
      }}
      onDragStart={() => {
        setIsDragging(true);
        // Store the initial position
        dragStartPosition.current = localPosition.clone();
      }}
      onDrag={(
        _localMatrix,
        _deltaLocalMatrix,
        _worldMatrix,
        deltaWorldMatrix
      ) => {
        if (!dragStartPosition.current) return;

        // Get the change in position from the delta world matrix
        const deltaPosition = new Vector3();
        deltaPosition.setFromMatrixPosition(deltaWorldMatrix);

        // Update the local position by adding the delta to the initial position
        const newPosition = dragStartPosition.current
          .clone()
          .add(deltaPosition);
        setLocalPosition(newPosition);
      }}
      onDragEnd={() => {
        // Update the store with the final position
        updateMeshPosition(mesh.id, localPosition);
        dragStartPosition.current = null;

        // Prevent the mesh from being selected when dragging has ended
        setTimeout(() => {
          setIsDragging(false);
        }, 100);
      }}
    >
      <group
        position={localPosition}
        scale={mesh.scale}
        ref={groupRef}
        onClick={handleClick}
        key={mesh.id}
      >
        {/* Render all parts of the model, so each part can be selected */}
        {mesh.parts.map((part) => (
          <Part key={part.name} part={part} meshId={mesh.id} />
        ))}
      </group>
    </DragControls>
  );
}

function Part({ part, meshId }: { part: MeshPart; meshId: string }) {
  const [hovered, setHovered] = useState(false);

  useCursor(hovered);
  const textures = useTextures();

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
  }, []);

  const handlePointerOut = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
  }, []);

  // Choose material based on mesh ID
  const materialProps = useMemo(() => {
    let materialProps: MeshStandardMaterialParameters = {};

    if (!part.material) {
      return materialProps;
    }

    const material = textures[part.material];

    if (!material) {
      return materialProps;
    }

    materialProps = {
      map: material.albedo,
      normalMap: material.normal,
      metalnessMap: material.metallic,
      aoMap: material.ao,
      displacementMap: material.height,
      displacementScale: 0.001,
    };

    return materialProps;
  }, [part.material, textures]);

  return (
    <mesh
      key={`${meshId}-${part.name}-${part.material}`}
      geometry={part.geometry}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <meshStandardMaterial {...materialProps} />
    </mesh>
  );
}
