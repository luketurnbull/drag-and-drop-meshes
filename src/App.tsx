import { Canvas } from "@react-three/fiber";
import Scene from "./components/scene";
import { Suspense, useRef, useState } from "react";
import { DraggableMesh } from "./utils/types";
import Models from "./components/models";
import {
  Vector3,
  BoxGeometry,
  SphereGeometry,
  CylinderGeometry,
  TorusKnotGeometry,
} from "three";
import { Html } from "@react-three/drei";
import Spinner from "./components/spinner";

// Initial primitive Three.js meshes
const PRIMITIVE_MESHES: DraggableMesh[] = [
  {
    id: "cube",
    position: new Vector3(0, 0, 0),
    geometry: new BoxGeometry(1, 1, 1),
    scale: 1,
  },
  {
    id: "sphere",
    position: new Vector3(0, 0, 0),
    geometry: new SphereGeometry(0.5, 100, 100),
    scale: 1,
  },
  {
    id: "cylinder",
    position: new Vector3(0, 0, 0),
    geometry: new CylinderGeometry(0.5, 0.5, 1, 10, 10),
    scale: 1,
  },
  {
    id: "torus-knot",
    position: new Vector3(0, 0, 0),
    geometry: new TorusKnotGeometry(0.5, 0.25, 100, 8),
    scale: 1,
  },
];

export default function App() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [dragItem, setDragItem] = useState<DraggableMesh | null>(null);
  const [meshes, setMeshes] = useState<DraggableMesh[]>(PRIMITIVE_MESHES);
  const [isLoading, setIsLoading] = useState(true);

  const handleModelsLoaded = (loadedMeshes: DraggableMesh[]) => {
    setMeshes([...PRIMITIVE_MESHES, ...loadedMeshes]);
    setIsLoading(false);
  };

  return (
    <main className="grid h-screen w-full grid-cols-[130px_1fr]">
      <aside className="bg-gray-100 p-4 h-screen overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 text-center">Meshes</h2>

        <div className="flex flex-col gap-2">
          {meshes.map((mesh) => (
            <button
              key={mesh.id}
              title="Drag me to the scene!"
              draggable
              onDragStart={() => {
                setDragItem(mesh);
              }}
              className="bg-gray-200 cursor-pointer active:cursor-grabbing rounded-md w-[100px] h-[100px] flex items-center justify-center 
              hover:shadow-lg hover:shadow-gray-400/50 hover:scale-105"
            >
              {mesh.id.charAt(0).toUpperCase() + mesh.id.slice(1)}
            </button>
          ))}
          {isLoading && (
            <div className="flex justify-center items-center">
              <span className="text-black h-10 w-10 mt-4">
                <Spinner />
              </span>
            </div>
          )}
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
          <Suspense
            fallback={
              <Html>
                <div className="flex justify-center items-center">
                  <span className="text-black h-20 w-20">
                    <Spinner />
                  </span>
                </div>
              </Html>
            }
          >
            <Models onModelsLoaded={handleModelsLoaded} />
            <Scene sectionRef={sectionRef} dragItem={dragItem} />
          </Suspense>
        </Canvas>
      </section>
    </main>
  );
}
