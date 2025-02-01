import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";
import { GhostMesh } from "../utils/types";

export default function Scene({ ghostMesh }: { ghostMesh: GhostMesh | null }) {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime();
    }
  });

  console.log("ghostMesh", ghostMesh);

  return (
    <>
      {ghostMesh && (
        <mesh ref={meshRef}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      )}
    </>
  );
}
