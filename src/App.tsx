import { Canvas } from "@react-three/fiber";
import Scene from "./components/scene";
import { useRef, useState } from "react";
import { useMeshStore } from "./store/mesh";
import { DraggableMesh } from "./utils/types";

export default function App() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [dragItem, setDragItem] = useState<DraggableMesh | null>(null);
  const availableMeshes = useMeshStore((state) => state.availableMeshes);

  return (
    <main className="grid h-screen w-full grid-cols-[130px_1fr]">
      <aside className="bg-gray-100 p-4 h-screen overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 text-center">Meshes</h2>

        <div className="flex flex-col gap-2">
          {availableMeshes.map((mesh) => (
            <button
              draggable
              onDragStart={() => {
                setDragItem(mesh);
              }}
              key={mesh.id}
              data-type={mesh.type}
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
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDragLeave={(e) => {
          e.preventDefault();
        }}
        ref={sectionRef}
      >
        <Canvas
          shadows
          camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [6, 4, 8],
          }}
        >
          <Scene sectionRef={sectionRef} dragItem={dragItem} />
        </Canvas>
      </section>
    </main>
  );
}
