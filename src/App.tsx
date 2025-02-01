import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Scene from "./components/scene";
import { useRef, useState } from "react";
import { Vector3 } from "three";
import { MeshType, GhostMesh } from "./utils/types";
import { MESHES } from "./utils/meshes";

export default function App() {
  const dragItem = useRef<HTMLButtonElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ghostMesh, setGhostMesh] = useState<GhostMesh | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
    dragItem.current = e.currentTarget;
  };

  const handleDragEnd = () => {
    dragItem.current = null;
  };

  const handleDragEnterCanvas = () => {
    if (dragItem.current) {
      setGhostMesh({
        type: dragItem.current.dataset.mesh as MeshType,
        position: new Vector3(0, 0, 0),
      });
    }
  };

  const handleDragLeaveCanvas = () => {
    if (dragItem.current) {
      setGhostMesh(null);
    }
  };

  return (
    <main className="grid h-screen w-full grid-cols-[130px_1fr]">
      <aside className="bg-gray-100 p-4 h-screen overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 text-center">Meshes</h2>

        <div className="flex flex-col gap-2">
          {MESHES.map((mesh) => (
            <button
              draggable
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              data-mesh={mesh}
              key={mesh}
              className="bg-gray-200 cursor-pointer active:cursor-grabbing rounded-md w-[100px] h-[100px] flex items-center justify-center 
              hover:shadow-lg hover:shadow-gray-400/50 hover:scale-105"
            >
              {mesh.charAt(0).toUpperCase() + mesh.slice(1)}
            </button>
          ))}
        </div>
      </aside>
      <section
        className="w-full h-full min-w-0"
        onDragEnter={handleDragEnterCanvas}
        onDragLeave={handleDragLeaveCanvas}
      >
        <Canvas
          shadows
          camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [6, 4, 8],
          }}
          ref={canvasRef}
        >
          <OrbitControls />

          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} />

          <Scene ghostMesh={ghostMesh} />
        </Canvas>
      </section>
    </main>
  );
}
