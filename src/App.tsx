import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Scene from "./components/scene";
import { useRef } from "react";

const MESHES = ["cube", "sphere", "cylinder"];

export default function App() {
  const dragItem = useRef<HTMLButtonElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
    dragItem.current = e.currentTarget;
  };

  const handleDragEnd = (e: React.DragEvent<HTMLButtonElement>) => {
    dragItem.current = null;
  };

  const handleDragEnterCanvas = (e: React.DragEvent<HTMLCanvasElement>) => {
    if (dragItem.current) {
      dragItem.current.style.opacity = "0.5";
    }
  };

  const handleDragLeaveCanvas = (e: React.DragEvent<HTMLCanvasElement>) => {
    if (dragItem.current) {
      dragItem.current.style.opacity = "1";
    }
  };

  return (
    <main className="grid h-screen w-full grid-cols-[300px_1fr]">
      <aside className="bg-gray-100 p-4">
        <h2 className="text-lg font-bold mb-2 text-center">Meshes</h2>

        <div className="flex flex-col gap-2">
          {MESHES.map((mesh) => (
            <button
              draggable
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              key={mesh}
              className="bg-gray-200 p-2 rounded-md"
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

          <Scene />
        </Canvas>
      </section>
    </main>
  );
}
