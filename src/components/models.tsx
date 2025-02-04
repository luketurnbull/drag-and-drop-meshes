import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useLoader } from "@react-three/fiber";
import { DraggableMesh } from "../utils/types";
import { Vector3, Mesh, BufferGeometry } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
dracoLoader.setDecoderConfig({ type: "js" });

// Add new models here
const GLTF_MODELS = [
  { id: "hamburger", path: "/hamburger.glb", scale: 0.1 },
  { id: "suzanne", path: "/suzanne.glb", scale: 0.5 },
  { id: "t-shirt", path: "/t-shirt.glb", scale: 2.0 },
] as const;

export default function Models({
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

  return null;
}
