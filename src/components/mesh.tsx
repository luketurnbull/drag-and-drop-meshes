import { DragControls, Html, Outlines } from "@react-three/drei";
import { useState } from "react";
import { DraggableMesh } from "../utils/types";
import Cross from "./cross";
import { useMeshStore } from "../store/mesh";

export default function Mesh({ id, position, geometry, scale }: DraggableMesh) {
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  const { deleteMesh } = useMeshStore();

  const handleDelete = () => {
    deleteMesh(id);
  };

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
          onPointerUp={() => {
            setSelected(!selected);
          }}
        >
          {selected && (
            <Html position={[0, 1, 0]} center transform={false}>
              <div className="bg-white p-2 rounded-md flex items-center justify-center">
                <button
                  className="text-black h-10 w-10 hover:cursor-pointer hover:text-red-500"
                  onClick={handleDelete}
                >
                  <Cross />
                </button>
              </div>
            </Html>
          )}
          <meshStandardMaterial color={hovered ? 0xff0000 : 0xcc0000} />
          {selected && <Outlines thickness={5} color="black" />}
        </mesh>
      </DragControls>
    </>
  );
}
