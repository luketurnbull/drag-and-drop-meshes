import { DraggableMesh } from "../utils/types";
import { BoxGeometry, SphereGeometry, Vector3 } from "three";
import { useMemo } from "react";
import Spinner from "../icons/Spinner";
import { useModels } from "../hooks/use-models";

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

export default function MeshSelection({
  setDragItem,
}: {
  setDragItem: (mesh: DraggableMesh) => void;
}) {
  // Load .gltf models
  const loadedMeshes = useModels();

  // Combine primitive Three.js meshes with loaded models
  const meshes = useMemo(
    () => [...PRIMITIVE_MESHES, ...loadedMeshes],
    [loadedMeshes]
  );
  const isLoading = loadedMeshes.length === 0;

  return (
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
  );
}
