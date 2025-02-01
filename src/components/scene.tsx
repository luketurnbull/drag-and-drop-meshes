import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  Mesh,
  SphereGeometry,
  TorusKnotGeometry,
  Vector2,
  Vector3,
} from "three";
import { MeshType } from "../utils/types";

const GEOMETRY_MAP: Record<MeshType, BufferGeometry> = {
  cube: new BoxGeometry(1, 1, 1),
  sphere: new SphereGeometry(0.5, 100, 100),
  cylinder: new CylinderGeometry(0.5, 0.5, 1, 10, 10),
  "torus-knot": new TorusKnotGeometry(0.5, 0.25, 100, 8),
};

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
      const geometry = GEOMETRY_MAP[dragItem];
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
