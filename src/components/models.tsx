import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useLoader } from "@react-three/fiber";
import { DraggableMesh, MeshPart } from "../utils/types";
import { Vector3, Mesh } from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { useEffect } from "react";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
dracoLoader.setDecoderConfig({ type: "js" });

// Add new models here
const GLTF_MODELS = [
  { id: "t-shirt", path: "/t-shirt.glb", scale: 2.0 },
  { id: "hamburger", path: "/hamburger.glb", scale: 0.1 },
  { id: "suzanne", path: "/suzanne.glb", scale: 0.5 },
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
    const parts: MeshPart[] = [];

    // Collect all meshes from the scene
    gltf.scene.traverse((child) => {
      if (child instanceof Mesh) {
        // Clone the geometry and apply the world transform
        const clonedGeometry = child.geometry.clone();
        clonedGeometry.applyMatrix4(child.matrixWorld);

        // Remove color attributes if they exist
        if (clonedGeometry.attributes.color) {
          delete clonedGeometry.attributes.color;
        }

        parts.push({
          name: child.name || `part-${parts.length}`,
          geometry: clonedGeometry,
        });
      }
    });

    if (parts.length === 0) {
      throw new Error(`No meshes found in model ${id}`);
    }

    return {
      id,
      position: new Vector3(0, 0, 0),
      scale,
      parts,
    };
  });

  // Call the callback with processed meshes
  onModelsLoaded(processedMeshes);

  // Cleanup geometries and dispose of models when unmounting
  useEffect(() => {
    return () => {
      processedMeshes.forEach((mesh) => {
        mesh.parts.forEach((part) => {
          part.geometry.dispose();
        });
      });

      models.forEach((gltf) => {
        gltf.scene.traverse((child) => {
          if (child instanceof Mesh) {
            child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((material) => material.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
        });
      });
    };
  }, [models, processedMeshes]);

  return null;
}
