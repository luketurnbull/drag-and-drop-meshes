import { useMeshStore } from "../store/mesh";

export default function MaterialSelection() {
  const setMeshMaterial = useMeshStore((state) => state.setMeshMaterial);

  return (
    <div>
      <h2 className="text-lg font-bold mb-4 text-center">Materials</h2>

      <div className="flex flex-col gap-2">
        <button
          className="bg-gray-200 cursor-pointer active:cursor-grabbing rounded-md w-[100px] h-[100px] flex items-center justify-center 
     hover:shadow-lg hover:shadow-gray-400/50 hover:scale-105"
          onClick={() => setMeshMaterial("redPlaid")}
        >
          <img
            src="/material/red-plaid/red-plaid_preview.jpg"
            className="w-full h-full object-cover"
            alt="Red Plaid"
          />
        </button>
        <button
          className="bg-gray-200 cursor-pointer active:cursor-grabbing rounded-md w-[100px] h-[100px] flex items-center justify-center 
     hover:shadow-lg hover:shadow-gray-400/50 hover:scale-105"
          onClick={() => setMeshMaterial("denim")}
        >
          <img
            src="/material/denim/jeans-fabric_preview.png"
            className="w-full h-full object-cover"
            alt="Denim"
          />
        </button>
        <button
          className="bg-gray-200 cursor-pointer active:cursor-grabbing rounded-md w-[100px] h-[100px] flex items-center justify-center 
     hover:shadow-lg hover:shadow-gray-400/50 hover:scale-105"
          onClick={() => setMeshMaterial("houndstooth")}
        >
          <img
            src="/material/houndstooth-fabric-weave/houndstooth-fabric-weave_preview.jpg"
            className="w-full h-full object-cover"
            alt="Houndstooth"
          />
        </button>
      </div>
    </div>
  );
}
