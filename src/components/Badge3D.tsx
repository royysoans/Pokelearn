import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const BadgeCoin = ({ color = "#facc15" }) => {
    const meshRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 1.5;
            // Slight tilt tilt to show the top of the coin
            meshRef.current.rotation.x = Math.PI / 8;
        }
    });

    return (
        <group ref={meshRef}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                {/* Main Coin Body */}
                <mesh castShadow receiveShadow>
                    <cylinderGeometry args={[1.5, 1.5, 0.2, 32]} />
                    <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
                </mesh>
                
                {/* Inner Ring Top */}
                <mesh position={[0, 0.11, 0]}>
                    <ringGeometry args={[1.1, 1.4, 32]} />
                    <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
                </mesh>
                
                {/* Inner Ring Bottom */}
                <mesh position={[0, -0.11, 0]} rotation={[Math.PI, 0, 0]}>
                    <ringGeometry args={[1.1, 1.4, 32]} />
                    <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
                </mesh>
            </Float>
            <Sparkles count={80} scale={4} size={6} speed={0.4} opacity={0.6} color={color} />
        </group>
    );
};

export function Badge3D({ color = "#facc15" }: { color?: string }) {
    return (
        <div className="w-full h-full min-h-[300px] relative">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 10]} intensity={1.5} />
                <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />
                <BadgeCoin color={color} />
                <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} />
            </Canvas>
        </div>
    );
}
