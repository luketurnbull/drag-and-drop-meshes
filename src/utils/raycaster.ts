import { Camera, Plane, Raycaster, Vector2, Vector3 } from "three";

export const getIntersectionPoint = (
  event: { clientX: number; clientY: number },
  camera: Camera,
  raycaster: Raycaster,
  domElement: HTMLCanvasElement
): Vector3 | null => {
  // Get normalized device coordinates
  const rect = domElement.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  // Update raycaster
  raycaster.setFromCamera(new Vector2(x, y), camera);

  // Create a plane at y=0
  const plane = new Plane(new Vector3(0, 1, 0), 0);
  const point = new Vector3();

  // Find intersection point
  const didIntersect = raycaster.ray.intersectPlane(plane, point);

  return didIntersect ? point : null;
};
