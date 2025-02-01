import { Canvas } from "@react-three/fiber";
import "./App.css";

export default function App() {
  return (
    <main className="main">
      <aside className="sidebar">
        <h2>Sidebar</h2>
      </aside>
      <section className="canvas">
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} />

          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="red" />
          </mesh>
        </Canvas>
      </section>
    </main>
  );
}
