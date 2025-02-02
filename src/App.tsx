import { Canvas } from "@react-three/fiber";
import Scene from "./components/scene";
import { Suspense, useRef, useState } from "react";
import { DraggableMesh } from "./utils/types";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import {
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  Mesh,
  SphereGeometry,
  TorusKnotGeometry,
  Vector3,
} from "three";
import { useLoader } from "@react-three/fiber";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Configure DRACO loader once
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
dracoLoader.setDecoderConfig({ type: "js" });

// Model definitions
const GLTF_MODELS = [
  { id: "hamburger", path: "/hamburger.glb", scale: 0.1 },
  { id: "suzanne", path: "/suzanne.glb", scale: 0.5 },
] as const;

// Initial primitive meshes
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

function Models({
  onModelsLoaded,
}: {
  onModelsLoaded: (meshes: DraggableMesh[]) => void;
}) {
  // Pre-load all models
  const models = useLoader(
    GLTFLoader,
    GLTF_MODELS.map((m) => m.path),
    (loader) => {
      loader.setDRACOLoader(dracoLoader);
    }
  );

  // Process models and add them to meshes
  const processedMeshes: DraggableMesh[] = models.map((gltf, index) => {
    const { id, scale } = GLTF_MODELS[index];
    const meshGeometries: BufferGeometry[] = [];

    // Collect all mesh geometries from the scene
    gltf.scene.traverse((child) => {
      if (child instanceof Mesh) {
        // Clone the geometry and apply the world transform
        const clonedGeometry = child.geometry.clone();
        clonedGeometry.applyMatrix4(child.matrixWorld);

        // Remove color attributes if they exist
        if (clonedGeometry.attributes.color) {
          delete clonedGeometry.attributes.color;
        }

        meshGeometries.push(clonedGeometry);
      }
    });

    if (meshGeometries.length === 0) {
      throw new Error(`No meshes found in model ${id}`);
    }

    // Merge all geometries into one
    const mergedGeometry = mergeGeometries(meshGeometries);

    // Clean up cloned geometries
    meshGeometries.forEach((geo) => geo.dispose());

    return {
      id,
      position: new Vector3(0, 0, 0),
      geometry: mergedGeometry,
      scale,
    };
  });

  // Call the callback with processed meshes
  onModelsLoaded(processedMeshes);

  return null; // This component is just for loading
}

export default function App() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [dragItem, setDragItem] = useState<DraggableMesh | null>(null);
  const [meshes, setMeshes] = useState<DraggableMesh[]>(PRIMITIVE_MESHES);

  const handleModelsLoaded = (loadedMeshes: DraggableMesh[]) => {
    setMeshes([...PRIMITIVE_MESHES, ...loadedMeshes]);
  };

  return (
    <main className="grid h-screen w-full grid-cols-[130px_1fr]">
      <aside className="bg-gray-100 p-4 h-screen overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 text-center">Meshes</h2>

        <div className="flex flex-col gap-2">
          {meshes.map((mesh) => (
            <button
              draggable
              onDragStart={() => {
                setDragItem(mesh);
              }}
              key={mesh.id}
              className="bg-gray-200 cursor-pointer active:cursor-grabbing rounded-md w-[100px] h-[100px] flex items-center justify-center 
              hover:shadow-lg hover:shadow-gray-400/50 hover:scale-105"
            >
              {mesh.id.charAt(0).toUpperCase() + mesh.id.slice(1)}
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
          <Suspense fallback={null}>
            <Models onModelsLoaded={handleModelsLoaded} />
            <Scene sectionRef={sectionRef} dragItem={dragItem} />
          </Suspense>
        </Canvas>
      </section>
    </main>
  );
}
