import { Canvas } from "@react-three/fiber";
import Scene from "./components/scene";
import { useEffect, useRef, useState } from "react";
import { DraggableMesh } from "./utils/types";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  Mesh,
  Object3D,
  SphereGeometry,
  TorusKnotGeometry,
  Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

const GLTF_MODELS: { id: string; path: string; scale?: number }[] = [
  {
    id: "hamburger",
    path: "/hamburger.glb",
    scale: 0.1,
  },
  // { id: "macbook", path: "/macbook.gltf" },
  { id: "suzanne", path: "/suzanne.glb", scale: 0.5 },
];

export default function App() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [dragItem, setDragItem] = useState<DraggableMesh | null>(null);
  const [meshes, setMeshes] = useState<DraggableMesh[]>([]);

  useEffect(() => {
    const loader = new GLTFLoader();
    const loadedMeshes: DraggableMesh[] = [
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

    const processMesh = (gltf: GLTF, id: string, scale?: number) => {
      const meshGeometries: BufferGeometry[] = [];

      gltf.scene.traverse((child: Object3D) => {
        if (child instanceof Mesh) {
          const clonedGeometry = child.geometry.clone();
          clonedGeometry.applyMatrix4(child.matrixWorld);

          if (clonedGeometry.attributes.color) {
            delete clonedGeometry.attributes.color;
          }

          meshGeometries.push(clonedGeometry);
        }
      });

      if (meshGeometries.length > 0) {
        try {
          const mergedGeometry = mergeGeometries(meshGeometries);
          loadedMeshes.push({
            id,
            position: new Vector3(0, 0, 0),
            geometry: mergedGeometry,
            scale,
          });
        } catch (error) {
          console.error(`Failed to merge geometries for ${id}:`, error);
        } finally {
          meshGeometries.forEach((geo) => geo.dispose());
        }
      }
    };

    GLTF_MODELS.forEach(({ id, path, scale }) => {
      loader.load(
        path,
        (gltf) => {
          try {
            processMesh(gltf, id, scale);
          } catch (error) {
            console.error(`Error processing ${id}:`, error);
          }
        },
        undefined,
        (error) => {
          console.error(`Failed to load ${id}:`, error);
        }
      );
    });

    setMeshes(loadedMeshes);
  }, []);

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
          <Scene sectionRef={sectionRef} dragItem={dragItem} />
        </Canvas>
      </section>
    </main>
  );
}
