import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Scene from "./components/scene";

export default function App() {
  return (
    <main className="grid h-screen w-full grid-cols-[300px_1fr]">
      <aside className="bg-gray-100 p-4">
        <h2>Sidebar</h2>
      </aside>
      <section className="w-full h-full min-w-0">
        <Canvas
          shadows
          camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [6, 4, 8],
          }}
        >
          <OrbitControls />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} />

          <Scene />
        </Canvas>
      </section>
    </main>
  );
}
