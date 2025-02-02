import { Canvas } from "@react-three/fiber";
import Scene from "./components/scene";
import { useRef, useState } from "react";
import { MeshType } from "./utils/types";
import { useMeshStore } from "./store/mesh";
import { BufferGeometry, Vector3 } from "three";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragItem, setDragItem] = useState<MeshType | null>(null);
  const addMesh = useMeshStore((state) => state.addMesh);
  const availableMeshes = useMeshStore((state) => state.availableMeshes);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (dragItem) {
      addMesh({
        type: dragItem,
        position: new Vector3(0, 0, 0),
        geometry: availableMeshes.find((mesh) => mesh.type === dragItem)
          ?.geometry as BufferGeometry,
      });
    }
  };

  return (
    <main className="grid h-screen w-full grid-cols-[130px_1fr]">
      <aside className="bg-gray-100 p-4 h-screen overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 text-center">Meshes</h2>

        <div className="flex flex-col gap-2">
          {availableMeshes.map((mesh) => (
            <button
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                setDragItem(mesh.type);
              }}
              key={mesh.id}
              className="bg-gray-200 cursor-pointer active:cursor-grabbing rounded-md w-[100px] h-[100px] flex items-center justify-center 
              hover:shadow-lg hover:shadow-gray-400/50 hover:scale-105"
            >
              {mesh.type.charAt(0).toUpperCase() + mesh.type.slice(1)}
            </button>
          ))}
        </div>
      </aside>
      <section
        className="w-full h-full min-w-0"
        onDragEnter={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
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
          <Scene />
        </Canvas>
      </section>
    </main>
  );
}
