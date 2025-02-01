import { Canvas } from "@react-three/fiber";
import "./app.css";
import Scene from "./components/scene";

export default function App() {
  return (
    <main className="main">
      <aside className="sidebar">
        <h2>Sidebar</h2>
      </aside>
      <section className="canvas">
        <Canvas
          shadows
          camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [6, 4, 8],
          }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} />

          <Scene />
        </Canvas>
      </section>
    </main>
  );
}
