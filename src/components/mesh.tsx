import { CameraControls, DragControls, useCursor } from "@react-three/drei";
import { useRef, useState, useCallback, useMemo } from "react";
import { DraggableMesh, MeshPart } from "../utils/types";

import { useMeshStore } from "../store/mesh";
import { Box3, Group } from "three";

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

  const isSelected = useMemo(
    () => selectedMeshId === mesh.id,
    [selectedMeshId, mesh.id]
  );

  const zoomToMesh = useCallback(() => {
    const boundingBox = new Box3().setFromObject(groupRef.current);
    controls.fitToBox(boundingBox, true).then(() => {
      controls.mouseButtons = {
        left: 0,
        wheel: 0,
        middle: 0,
        right: 0,
      };
      controls.touches = {
        one: 0,
        two: 0,
        three: 0,
      };
    });
  }, [controls]);

  if (mesh.parts.length === 0) return null;

  return (
    <>
      <DragControls key={mesh.id}>
        <group
          position={mesh.position}
          scale={mesh.scale}
          ref={groupRef}
          onClick={() => {
            if (isSelected) return;
            editMesh(mesh.id);
            zoomToMesh();
          }}
        >
          {mesh.parts.map((part) => (
            <Part part={part} selected={isSelected} key={part.name} />
          ))}
        </group>
      </DragControls>
    </>
  );
}

function Part({ part, selected }: { part: MeshPart; selected: boolean }) {
  const [hovered, setHovered] = useState(false);

  useCursor(hovered);

  return (
    <mesh
      geometry={part.geometry}
      onPointerOver={(e) => {
        if (selected) return;
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        if (selected) return;
        e.stopPropagation();
        setHovered(false);
      }}
    >
      <meshStandardMaterial color={hovered ? 0xff0000 : 0xcc0000} />
    </mesh>
  );
}
