import { Canvas } from "@react-three/fiber";
import Scene from "./components/scene";
import { Suspense, useMemo, useRef, useState } from "react";
import { DraggableMesh } from "./utils/types";
import { useModels } from "./hooks/use-models";
import { Vector3, BoxGeometry, SphereGeometry } from "three";
import { Html, CameraControls } from "@react-three/drei";
import Spinner from "./icons/Spinner";
import { useMeshStore } from "./store/mesh";
import BackIcon from "./icons/Back";
import { setCameraState } from "./utils/camera";

// Initial primitive Three.js meshes
const PRIMITIVE_MESHES: DraggableMesh[] = [
  {
    id: "cube",
    position: new Vector3(0, 0, 0),
    parts: [
      {
        name: "cube",
        geometry: new BoxGeometry(1, 1, 1),
      },
    ],
    scale: 1,
  },
  {
    id: "sphere",
    position: new Vector3(0, 0, 0),
    parts: [
      {
        name: "sphere",
        geometry: new SphereGeometry(0.5, 100, 100),
      },
    ],
    scale: 1,
  },
];

export default function App() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [dragItem, setDragItem] = useState<DraggableMesh | null>(null);
  const controls = useRef<CameraControls>(null!);

  const selectedMeshId = useMeshStore((state) => state.selectedMeshId);
  const resetSelectedMesh = useMeshStore((state) => state.resetSelectedMesh);

  const isMeshSelected = useMemo(
    () => selectedMeshId !== null,
    [selectedMeshId]
  );

  // Load models using the hook
  const loadedMeshes = useModels();
  const meshes = useMemo(
    () => [...PRIMITIVE_MESHES, ...loadedMeshes],
    [loadedMeshes]
  );
  const isLoading = loadedMeshes.length === 0;

  const handleBackClick = () => {
    if (controls.current) {
      setCameraState(controls.current, "default");
    }
    resetSelectedMesh();
  };

  return (
    <main className="grid h-screen w-full grid-cols-[130px_1fr]">
      <aside className="bg-gray-100 p-4 h-screen overflow-y-auto">
        {!isMeshSelected && (
          <div>
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
          </div>
        )}
        {isMeshSelected && (
          <div>
            <h2 className="text-lg font-bold mb-4 text-center">Materials</h2>
          </div>
        )}
      </aside>

      <section
        className="w-full h-full min-w-0 relative"
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
          <CameraControls makeDefault ref={controls} />

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
            <Scene
              controls={controls.current}
              sectionRef={sectionRef}
              dragItem={dragItem}
            />
          </Suspense>
        </Canvas>

        {isMeshSelected && (
          <div className="absolute top-4 right-4 flex items-center justify-center">
            <button
              title="Back"
              onClick={handleBackClick}
              className="p-4 bg-gray-100 rounded-full hover:bg-gray-200 hover:cursor-pointer"
            >
              <span className="text-black h-6 w-6 hover:text-gray-900 flex">
                <BackIcon />
              </span>
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
