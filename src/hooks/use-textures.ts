import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";
import { RepeatWrapping, Texture } from "three";
import { MaterialTextures } from "../utils/types";

export function useTextures(): MaterialTextures {
  // Load all textures for red plaid
  const [
    redPlaidAlbedo,
    redPlaidNormal,
    redPlaidMetallic,
    redPlaidAo,
    redPlaidHeight,
    // Denim textures
    denimAlbedo,
    denimNormal,
    denimMetallic,
    denimAo,
    denimHeight,
    // Houndstooth textures
    houndstoothAlbedo,
    houndstoothNormal,
    houndstoothMetallic,
    houndstoothAo,
    houndstoothHeight,
    houndstoothRoughness,
  ] = useLoader(TextureLoader, [
    // Red Plaid textures
    "/material/red-plaid/red-plaid_albedo.png",
    "/material/red-plaid/red-plaid_normal-ogl.png",
    "/material/red-plaid/red-plaid_metallic.png",
    "/material/red-plaid/red-plaid_ao.png",
    "/material/red-plaid/red-plaid_height.png",
    // Denim textures
    "/material/denim/jeans-fabric_albedo.png",
    "/material/denim/jeans-fabric_normal-ogl.png",
    "/material/denim/jeans-fabric_metallic.png",
    "/material/denim/jeans-fabric_ao.png",
    "/material/denim/jeans-fabric_height.png",
    // Houndstooth textures
    "/material/houndstooth-fabric-weave/houndstooth-fabric-weave_albedo.png",
    "/material/houndstooth-fabric-weave/houndstooth-fabric-weave_normal-ogl.png",
    "/material/houndstooth-fabric-weave/houndstooth-fabric-weave_metallic.png",
    "/material/houndstooth-fabric-weave/houndstooth-fabric-weave_ao.png",
    "/material/houndstooth-fabric-weave/houndstooth-fabric-weave_height.png",
    "/material/houndstooth-fabric-weave/houndstooth-fabric-weave_Roughness.png",
  ]);

  // Configure texture settings with optimizations
  const configureTexture = (texture: Texture) => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    // Add performance optimizations
    texture.generateMipmaps = true;
    texture.needsUpdate = false;
    return texture;
  };

  // Configure all textures
  [
    redPlaidAlbedo,
    redPlaidNormal,
    redPlaidMetallic,
    redPlaidAo,
    redPlaidHeight,
    denimAlbedo,
    denimNormal,
    denimMetallic,
    denimAo,
    denimHeight,
    houndstoothAlbedo,
    houndstoothNormal,
    houndstoothMetallic,
    houndstoothAo,
    houndstoothHeight,
    houndstoothRoughness,
  ].forEach(configureTexture);

  return {
    redPlaid: {
      albedo: redPlaidAlbedo,
      normal: redPlaidNormal,
      metallic: redPlaidMetallic,
      ao: redPlaidAo,
      height: redPlaidHeight,
    },
    denim: {
      albedo: denimAlbedo,
      normal: denimNormal,
      metallic: denimMetallic,
      ao: denimAo,
      height: denimHeight,
    },
    houndstooth: {
      albedo: houndstoothAlbedo,
      normal: houndstoothNormal,
      metallic: houndstoothMetallic,
      ao: houndstoothAo,
      height: houndstoothHeight,
      roughness: houndstoothRoughness,
    },
  };
}
