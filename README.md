# Drag and drop meshes

A sidebar with draggable meshes and a material selection.

Drag and drop meshes to the scene.
Click on a mesh to select it.
Click on the trash icon to delete the selected mesh.
Select a material to change the color of the selected mesh.

Deployed on Vercel: https://drag-and-drop-meshes.vercel.app/

## Run the project

```bash
pnpm install
```

```bash
pnpm run dev
```

## Add new models to the sidebar

To add new models, add them to the `public/models` folder and add the name to the `GLTF_MODELS` array in `src/components/models.tsx`.
