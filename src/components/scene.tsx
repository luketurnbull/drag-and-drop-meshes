import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { BufferGeometry, Mesh, Vector3 } from "three";
import { MeshType } from "../utils/types";
import { GEOMETRY_MAP } from "../utils/meshes";

export default function Scene({
  isOverCanvas,
  dragItem,
}: {
  isOverCanvas: boolean;
  dragItem: MeshType | null;
}) {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime();
    }
  });

  const ghostMesh = useMemo(() => {
    if (isOverCanvas && dragItem) {
      const geometry: BufferGeometry = GEOMETRY_MAP[dragItem];

      return {
        type: dragItem,
        position: new Vector3(0, 0, 0),
        geometry,
      };
    }
  }, [isOverCanvas, dragItem]);

  return (
    <>
      {ghostMesh && (
        <mesh
          ref={meshRef}
          position={ghostMesh.position}
          geometry={ghostMesh.geometry}
        >
          <meshStandardMaterial color="red" />
        </mesh>
      )}
    </>
  );
}
