"use client";
import * as THREE from "three";
import { useEffect } from "react";

export default function PokeCursor() {
  useEffect(() => {
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(60, 60); // Pokéball size
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.pointerEvents = "none";
    renderer.domElement.style.zIndex = "9999";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.top = "0";
    document.body.style.cursor = "none"; // hide system cursor
    document.body.appendChild(renderer.domElement);

    // Scene + Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 2;

    // Environment reflection map (adds shine)
    const cubeLoader = new THREE.CubeTextureLoader();
    const envMap = cubeLoader.load([
      "https://threejs.org/examples/textures/cube/Bridge2/posx.jpg",
      "https://threejs.org/examples/textures/cube/Bridge2/negx.jpg",
      "https://threejs.org/examples/textures/cube/Bridge2/posy.jpg",
      "https://threejs.org/examples/textures/cube/Bridge2/negy.jpg",
      "https://threejs.org/examples/textures/cube/Bridge2/posz.jpg",
      "https://threejs.org/examples/textures/cube/Bridge2/negz.jpg",
    ]);
    scene.environment = envMap;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    const pointLight = new THREE.PointLight(0xffffff, 2);
    pointLight.position.set(1, 2, 3);
    scene.add(ambientLight, pointLight);

    // Pokéball parts
    const radius = 0.5;

    const topMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      metalness: 0.6,
      roughness: 0.2,
      envMap,
    });
    const bottomMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.5,
      roughness: 0.2,
      envMap,
    });
    const bandMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      metalness: 1.0,
      roughness: 0.1,
      envMap,
    });
    const buttonMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.4,
      metalness: 0.5,
      roughness: 0.1,
      envMap,
    });

    // Top hemisphere (red)
    const topHalfGeom = new THREE.SphereGeometry(radius, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const topHalf = new THREE.Mesh(topHalfGeom, topMaterial);

    // Bottom hemisphere (white)
    const bottomHalfGeom = new THREE.SphereGeometry(radius, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const bottomHalf = new THREE.Mesh(bottomHalfGeom, bottomMaterial);

    // Black band
    const bandGeom = new THREE.TorusGeometry(radius * 0.75, 0.05, 16, 100);
    const band = new THREE.Mesh(bandGeom, bandMaterial);
    band.rotation.x = Math.PI / 2;

    // Center button
    const buttonGeom = new THREE.CircleGeometry(0.1, 32);
    const button = new THREE.Mesh(buttonGeom, buttonMaterial);
    button.position.z = radius + 0.012; // sits above band

    // Group and add to scene
    const pokeball = new THREE.Group();
    pokeball.add(topHalf, bottomHalf, band, button);
    scene.add(pokeball);

    // Mouse movement handler
    const moveCursor = (e: MouseEvent) => {
      renderer.domElement.style.left = `${e.clientX - 30}px`;
      renderer.domElement.style.top = `${e.clientY - 30}px`;
    };
    window.addEventListener("mousemove", moveCursor);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      pokeball.rotation.x += 0.05;
      pokeball.rotation.y += 0.05;
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null;
}
