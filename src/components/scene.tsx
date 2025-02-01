import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { BufferGeometry, Mesh, Vector2, Vector3 } from "three";
import { MeshType } from "../utils/types";
import { GEOMETRY_MAP } from "../utils/meshes";

export default function Scene({
  isOverCanvas,
  dragItem,
  canvasRef,
}: {
  isOverCanvas: boolean;
  dragItem: MeshType | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}) {
  const meshRef = useRef<Mesh>(null);
  const { camera } = useThree();

  const [pointer, setPointer] = useState(new Vector2());

  const updatePointerPosition = (x: number, y: number) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const normalizedX = ((x - rect.left) / rect.width) * 2 - 1;
      const normalizedY = -((y - rect.top) / rect.height) * 2 + 1;
      setPointer(new Vector2(normalizedX, normalizedY));
    }
  };

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      updatePointerPosition(event.clientX, event.clientY);
    };

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
      updatePointerPosition(event.clientX, event.clientY);
    };

    if (canvasRef.current) {
      canvasRef.current.addEventListener("pointermove", handlePointerMove);
      canvasRef.current.addEventListener("dragover", handleDragOver);
    }

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("pointermove", handlePointerMove);
        canvasRef.current.removeEventListener("dragover", handleDragOver);
      }
    };
  }, [canvasRef]);

  useFrame(() => {
    if (meshRef.current && isOverCanvas) {
      // Create a vector at the mouse position and the far plane
      const vector = new Vector3(pointer.x, pointer.y, 0.5);
      vector.unproject(camera);

      // Calculate direction from camera to mouse position
      const dir = vector.sub(camera.position).normalize();

      // Position mesh at a fixed distance from camera along the ray
      const distance = 5;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));

      meshRef.current.position.copy(pos);
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
