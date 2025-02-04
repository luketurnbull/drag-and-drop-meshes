import { CameraControls, DragControls, Html } from "@react-three/drei";
import { useEffect, useRef, useState, useCallback } from "react";
import { DraggableMesh } from "../utils/types";
import Cross from "./cross";
import Edit from "./edit";
import { useMeshStore } from "../store/mesh";
import { Mesh as ThreeMesh, Box3 } from "three";

type MeshProps = DraggableMesh & {
  controls: CameraControls;
};

export default function Mesh({
  id,
  position,
  geometry,
  scale,
  controls,
}: MeshProps) {
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  const meshRef = useRef<ThreeMesh>(null!);
  const { deleteMesh } = useMeshStore();

  const handleDelete = () => {
    deleteMesh(id);
  };

  const zoomToMesh = useCallback(() => {
    const boundingBox = new Box3().setFromObject(meshRef.current);
    controls.fitToBox(boundingBox, true);
  }, [controls, meshRef]);

  if (!geometry) return null;

  return (
    <>
      <DragControls
        key={id}
        autoTransform
        onHover={(hovered) => {
          setHovered(hovered);
          document.body.style.cursor = hovered ? "pointer" : "default";
        }}
        onDrag={() => {
          document.body.style.cursor = "grabbing";
          setSelected(false);
        }}
        onDragEnd={() => {
          document.body.style.cursor = "pointer";
        }}
      >
        <mesh
          geometry={geometry}
          position={position}
          scale={scale}
          ref={meshRef}
          onPointerUp={() => {
            setSelected(true);
          }}
        >
          {selected && (
            <Html position={[0, 1, 0]} center transform={false}>
              <div className="bg-white p-2 rounded-md flex items-center justify-center">
                <button
                  title="Delete mesh"
                  className="text-black h-10 w-10 hover:cursor-pointer hover:text-red-500"
                  onClick={handleDelete}
                >
                  <Cross />
                </button>
                <button
                  title="Edit mesh"
                  className="text-black h-10 w-10 hover:cursor-pointer hover:text-blue-500"
                  onClick={() => {
                    console.log("edit");
                    zoomToMesh();
                  }}
                >
                  <Edit />
                </button>
              </div>
            </Html>
          )}
          <meshStandardMaterial color={hovered ? 0xff0000 : 0xcc0000} />
        </mesh>
      </DragControls>
    </>
  );
}
