import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";
import { RepeatWrapping, Texture } from "three";

interface TextureSet {
  albedo: Texture;
  normal: Texture;
  metallic: Texture;
  ao: Texture;
  height: Texture;
}

interface MaterialTextures {
  redPlaid: TextureSet;
  // Add more material sets here as needed
}

export function useTextures(): MaterialTextures {
  // Load all textures for red plaid
  const [
    redPlaidAlbedo,
    redPlaidNormal,
    redPlaidMetallic,
    redPlaidAo,
    redPlaidHeight,
  ] = useLoader(TextureLoader, [
    "/material/red-plaid/red-plaid_albedo.png",
    "/material/red-plaid/red-plaid_normal-ogl.png",
    "/material/red-plaid/red-plaid_metallic.png",
    "/material/red-plaid/red-plaid_ao.png",
    "/material/red-plaid/red-plaid_height.png",
  ]);

  // Configure texture settings
  const configureTexture = (texture: Texture) => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    return texture;
  };

  // Configure all textures
  [
    redPlaidAlbedo,
    redPlaidNormal,
    redPlaidMetallic,
    redPlaidAo,
    redPlaidHeight,
  ].forEach(configureTexture);

  return {
    redPlaid: {
      albedo: redPlaidAlbedo,
      normal: redPlaidNormal,
      metallic: redPlaidMetallic,
      ao: redPlaidAo,
      height: redPlaidHeight,
    },
  };
}
