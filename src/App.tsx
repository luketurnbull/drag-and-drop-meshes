import { Canvas } from "@react-three/fiber";
import Scene from "./components/scene";
import { Suspense, useMemo, useRef, useState } from "react";
import { DraggableMesh } from "./utils/types";
import { Html, CameraControls } from "@react-three/drei";
import Spinner from "./icons/Spinner";
import BackIcon from "./icons/Back";
import TrashIcon from "./icons/Trash";
import { useMeshStore } from "./store/mesh";
import { useCamera } from "./hooks/use-camera";
import MeshSelection from "./components/mesh-selection";
import MaterialSelection from "./components/material-selection";

// Main App component
// Handles the UI and scene
export default function App() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [dragItem, setDragItem] = useState<DraggableMesh | null>(null);
  const controls = useRef<CameraControls>(null!);
  const { setCameraState } = useCamera(controls.current);

  const selectedMeshId = useMeshStore((state) => state.selectedMeshId);
  const resetSelectedMesh = useMeshStore((state) => state.resetSelectedMesh);
  const deleteMesh = useMeshStore((state) => state.deleteMesh);

  const isMeshSelected = useMemo(
    () => selectedMeshId !== null,
    [selectedMeshId]
  );

  const handleBackClick = () => {
    setCameraState("default");
    resetSelectedMesh();
  };

  const handleDeleteClick = () => {
    if (selectedMeshId) {
      deleteMesh(selectedMeshId);
      setCameraState("default");
      resetSelectedMesh();
    }
  };

  return (
    <main className="grid h-screen w-full grid-cols-[130px_1fr]">
      <aside className="bg-gray-100 p-4 h-screen overflow-y-auto">
        {isMeshSelected ? (
          <MaterialSelection />
        ) : (
          <MeshSelection setDragItem={setDragItem} />
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
            position: [4, 4, 6],
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
          <div className="absolute top-4 right-4 flex flex-col gap-2 items-center justify-center">
            <button
              title="Back"
              onClick={handleBackClick}
              className="p-4 bg-gray-100 rounded-full hover:bg-gray-200 hover:cursor-pointer"
            >
              <span className="text-black h-6 w-6 hover:text-gray-900 flex">
                <BackIcon />
              </span>
            </button>
            <button
              title="Delete"
              onClick={handleDeleteClick}
              className="p-4 bg-gray-100 rounded-full hover:bg-gray-200 hover:cursor-pointer"
            >
              <span className="text-black h-6 w-6 hover:text-gray-900 flex">
                <TrashIcon />
              </span>
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
