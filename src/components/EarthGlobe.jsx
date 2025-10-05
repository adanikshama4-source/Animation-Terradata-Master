import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture, Html,useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const AU_DISTANCE = 15; 
const ORBIT_ECCENTRICITY = 1.35;
const ORBIT_TILT_Z = 15 * Math.PI / 180;
const SUN_SIZE = 4;
const EARTH_SIZE = 2;
const MOON_SIZE = 0.5;
const SATELLITE_SIZE = 0.00005;
const SATELLITE_DISTANCE = 2.8;
const MOON_DISTANCE = 3.5; 
const EARTH_ORBIT_SPEED = 0.05; 
const MOON_ORBIT_SPEED = 0.5;
const SUN_ROTATION_SPEED = 0.003;
const SATELLITE_ORBIT_SPEED = 1.5; 
const SUN_SHIFT_X = -3; 
const SUN_COLOR_PATH = `/8k_sun_texture.jpg`;
const MOON_COLOR_PATH = `/8k_moon_textures.jpg`;
const SATELLITE_MODEL_PATH = `/Terra.glb`; 
//const SUN_BUMP_PATH = "/textures/sun_bump.jpg";

function OrbitLine() {
    return (
        <mesh rotation-x={Math.PI / 2}
            scale={[ORBIT_ECCENTRICITY, 1, 1]}> 
            <ringGeometry args={[AU_DISTANCE - 0.05, AU_DISTANCE + 0.05, 128]} />
            <meshBasicMaterial color={0x333333} side={THREE.DoubleSide} />
        </mesh>
    );
}

function Sun() {
    const sunRef = useRef(); 
    const [colorMap] = useTexture([SUN_COLOR_PATH]);
    
     useFrame(() => {
        if (sunRef.current) {
            sunRef.current.rotation.y += SUN_ROTATION_SPEED;
        }
    });

    return (
        <group ref={sunRef} position={[SUN_SHIFT_X, 0, 0]}> 
            <mesh>
                <sphereGeometry args={[SUN_SIZE, 64, 64]} />
                <meshStandardMaterial
                    emissiveMap={colorMap}  
                    color={0x000000} 
                    emissive={0xFFFFFF} 
                    emissiveIntensity={3.5} 
                />
            </mesh>
            
            {/* NEW: Main light source for the system (Sun's light) */}
            <pointLight 
                intensity={10} 
                distance={1000}
                color={0xffffff} 
                decay={0.01} 
            />
        </group>
    );
}

function Moon() {
    const moonRef = useRef();
    const [colorMap] = useTexture([MOON_COLOR_PATH]);

    useFrame(() => {
        if (moonRef.current) {
            moonRef.current.rotation.y += 0.005; 
        }
    });

    return (
        <mesh ref={moonRef} position={[0, 0, 0]}>
            <sphereGeometry args={[MOON_SIZE, 32, 32]} />
            <meshStandardMaterial
                map={colorMap}
                color={0xFFFFFF}
            />
        </mesh>
    );
}


function MoonOrbitAnimator() {
    const moonOrbitRef = useRef();
    
    useFrame(({ clock }) => {
        if (moonOrbitRef.current) {
            moonOrbitRef.current.rotation.y = clock.getElapsedTime() * MOON_ORBIT_SPEED;
        }
    });

    return (
        <group ref={moonOrbitRef}>
            <group position={[MOON_DISTANCE, 0, 0]}>
                <Moon />
            </group>
        </group>
    );
}

function Satellite() {
    const { scene } = useGLTF(SATELLITE_MODEL_PATH); 
    
    return (
        <primitive object={scene} scale={SATELLITE_SIZE} />
    );
}

function SatelliteOrbitAnimator() {
    const satelliteOrbitRef = useRef();
    
    useFrame(({ clock }) => {
        if (satelliteOrbitRef.current) {
            satelliteOrbitRef.current.rotation.y = clock.getElapsedTime() * SATELLITE_ORBIT_SPEED;
        }
    });

    return (
        <group ref={satelliteOrbitRef}>
            <group position={[SATELLITE_DISTANCE, 0, 0]} rotation-x={-Math.PI / 4}>
                <Satellite />
            </group>
        </group>
    );
}


function Earth({ currentYear, dataType = 'land' }) {
    const earthRef = useRef();
    const cloudsRef = useRef(); 
    const earthGroupRef = useRef();
    
    const yearString = String(currentYear);
    
    const colorMapPath = `/LandCover_Output/land_cover_${yearString}.png`; 
    const bumpMapPath = `/SurfaceBumpData_HTML/globe_bump_${yearString}.png`; 
    const atmosphereMapPath = `/NASA_Atmosphere_Output/year_average_${yearString}.png`; 

    const [colorMap, bumpMap, atmosphereMap] = useTexture([
        colorMapPath,
        bumpMapPath,
        atmosphereMapPath 
    ], (textures) => {
        if (textures[1]) {
            textures[1].colorSpace = THREE.NoColorSpace;
        }
    });

    useFrame(() => {
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.02; 
        }
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y += 0.0025; 
        }
    });

    const getMaterialProps = (map, bump = false) => {
        if (!map) return {};
        
        return bump ? { bumpMap: map } : { map: map };
    };

    const getEarthMaterial = () => {
        switch (dataType) {
            case 'bump':
                return (
                    <meshStandardMaterial 
                        color={0xFFFFFF} 
                        {...getMaterialProps(bumpMap)}
                        bumpScale={20} 
                    />
                );
            case 'atmosphere':
                return (
                    <meshStandardMaterial 
                        color={0xFFFFFF} 
                        {...getMaterialProps(atmosphereMap)}
                        transparent={true}
                        opacity={0.8}
                    />
                );
            case 'land':
            default:
                return (
                    <meshStandardMaterial 
                        color={0xFFFFFF} 
                        {...getMaterialProps(colorMap)}
                        {...getMaterialProps(bumpMap, true)}
                        bumpScale={10} 
                    />
                );
        }
    };

    const getAtmosphereMaterial = () => {
        if (dataType === 'atmosphere') {
            return (
                <meshPhongMaterial
                    {...getMaterialProps(atmosphereMap)}
                    transparent={true}
                    opacity={0.3}
                    side={THREE.BackSide} 
                    blending={THREE.AdditiveBlending}
                />
            );
        }
        return (
            <meshPhongMaterial
                {...getMaterialProps(atmosphereMap)}
                transparent={true}
                opacity={0.65}
                side={THREE.BackSide} 
                blending={THREE.AdditiveBlending}
            />
        );
    };

    return (
        <group ref={earthGroupRef} rotation-z={-23.5 * Math.PI / 180}>
            
            <mesh ref={earthRef} position={[0, 0, 0]}>
                <sphereGeometry args={[EARTH_SIZE, 64, 64]} /> 
                {getEarthMaterial()}
            </mesh>
            
            <mesh ref={cloudsRef} position={[0, 0, 0]} scale={2.05}>
                <sphereGeometry args={[1, 64, 64]} />
                {getAtmosphereMaterial()}
            </mesh>
            <MoonOrbitAnimator />
            <SatelliteOrbitAnimator /> 

        </group>
    );
}

function EarthOrbitAnimator({ currentYear, dataType, onOrbitComplete }) {
    const earthOrbitRef = useRef(); 
    const lastOrbitTime = useRef(0);
    const orbitCount = useRef(0);
    
    useFrame(({ clock }) => {
        if (earthOrbitRef.current) {
          const t = clock.getElapsedTime() * EARTH_ORBIT_SPEED;
            
            const x = AU_DISTANCE * ORBIT_ECCENTRICITY * Math.cos(t);
            const z = AU_DISTANCE * Math.sin(t);

            earthOrbitRef.current.position.x = x;
            earthOrbitRef.current.position.z = z;
            
            // Track orbit completion (when t completes a full 2π cycle)
            const currentOrbitTime = Math.floor(t / (2 * Math.PI));
            if (currentOrbitTime > lastOrbitTime.current) {
                lastOrbitTime.current = currentOrbitTime;
                orbitCount.current += 1;
                
                // Call the callback when orbit completes
                if (onOrbitComplete) {
                    onOrbitComplete(orbitCount.current);
                }
            }
        }
    });

    return (
        <group ref={earthOrbitRef}>
            <group position={[0, 0, 0]}> 
                <Earth currentYear={currentYear} dataType={dataType} />
                {/* SATELLITE  */}
            </group>
        </group>
    );
}


export default function EarthGlobe({ currentYear, startYear, endYear, dataType = 'land', onOrbitComplete }) {
    const earthOrbitRef = useRef(); 
    //  useFrame(({ clock }) => {
    //     if (earthOrbitRef.current) {
    //         earthOrbitRef.current.rotation.y = clock.getElapsedTime() * EARTH_ORBIT_SPEED;
    //     }
    // });
    
    return (
        <Canvas 
            camera={{ position: [AU_DISTANCE + SUN_SHIFT_X + 1,2,5], fov: 50 }} 
            style={{ background: '#000000' }}
        >
            <Suspense fallback={<Html center className="text-white">Loading Solar System Data...</Html>}>
                
                {/* <directionalLight 
                    position={[-9, 0, 0]} 
                    intensity={5}        
                    color={0xffffee} 
                /> */}
                <Sun />
                 <group rotation-z={ORBIT_TILT_Z}>
                 
                <OrbitLine />

                <EarthOrbitAnimator 
                    currentYear={currentYear} 
                    dataType={dataType} 
                    onOrbitComplete={onOrbitComplete}
                />
                 </group>
            
                <ambientLight intensity={0.05} />

                {/* <group ref={earthOrbitRef}>
                    <group position={[AU_DISTANCE, 0, 0]}>
                        <Earth currentYear={currentYear} />
                        {/*   MOON  
                        {/* SATELLITE  
                    </group>
                </group> */}
                
                <Stars radius={200} depth={100} count={10000} factor={8} saturation={0.8} fade speed={1.5} />                 
                <OrbitControls 
                    enableZoom={true} 
                    enablePan={false} 
                    maxDistance={AU_DISTANCE + 25}
                    minDistance={2}
                    enableDamping={true} 
                    dampingFactor={0.05} 
                />
                
            </Suspense>
        </Canvas>
    );
}
