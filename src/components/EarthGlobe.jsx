import React, { useRef, Suspense, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// --- CONSTANTS FOR THE SOLAR SYSTEM STRUCTURE ---
const AU_DISTANCE = 15;
const ORBIT_ECCENTRICITY = 1.02;
const ORBIT_TILT_Z = 15 * Math.PI / 180;
const SUN_SIZE = 4;
const EARTH_SIZE = 2;
const MOON_SIZE = 0.5;
const SATELLITE_DISTANCE = 2.8;
const MOON_DISTANCE = 3.5;
const EARTH_ORBIT_SPEED = 0.05;
const EARTH_FOCUSED_SPEED = 0.005;
const MOON_ORBIT_SPEED = 0.5;
const SUN_ROTATION_SPEED = 0.003;
const SATELLITE_ORBIT_SPEED = 1.5;
const SUN_SHIFT_X = -3;
const SUN_COLOR_PATH = `/8k_sun_texture.jpg`;
const MOON_COLOR_PATH = `/8k_moon_textures.jpg`;
const SATELLITE_MODEL_PATH = `/Terra.glb`;
const SAFE_ZOOM_DISTANCE = EARTH_SIZE * 5; // Minimum distance when zoomed in on Earth

/**
 * Component to draw the elliptical orbit line for Earth.
 */
function OrbitLine() {
    return (
        <mesh rotation-x={Math.PI / 2}
            scale={[ORBIT_ECCENTRICITY, 1, 1]}>
            <ringGeometry args={[AU_DISTANCE - 0.05, AU_DISTANCE + 0.05, 128]} />
            <meshBasicMaterial color={0x333333} side={THREE.DoubleSide} />
        </mesh>
    );
}

/**
 * Sun component with Texture, Rotation, and Light Source.
 */
function Sun() {
    const sunRef = useRef();
    const [colorMap] = useTexture([SUN_COLOR_PATH]);

    // Sun's self-rotation (axial rotation)
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

            <pointLight
                intensity={10} // High intensity for proper Earth illumination
                distance={100}
                position={[0, 0, 0]}
                color={0xFFFFFF}
                decay={0.1}
            />
        </group>
    );
}

/**
 * Moon Mesh Component
 */
function Moon() {
    const moonRef = useRef();
    const [colorMap] = useTexture([MOON_COLOR_PATH]);

    // Moon's self-rotation 
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

/**
 * Satellite Mesh Component (using a GLB model)
 */
function Satellite() {
    // Note: useGLTF loads the model only once.
    const { scene } = useGLTF(SATELLITE_MODEL_PATH);

    // Small rotation on the model itself
    useFrame(() => {
        if (scene) {
            scene.rotation.y += 0.02;
            scene.rotation.x += 0.01;
        }
    });

    // NOTE: The model's scale is fixed here.
    return (
        // The scale is very small because it's orbiting the Earth mesh (size 2)
        <primitive object={scene} scale={0.00005} />
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

/**
 * Earth component, handles textures and material switching based on dataType.
 */
function Earth({ currentYear, dataType = 'earth', onEarthClick, isFocused }) {
    const earthRef = useRef();
    const cloudsRef = useRef();
    const earthGroupRef = useRef();
    const cloudTextureRef = useRef();

    const yearString = String(currentYear);

    const colorMapPath = `/LandCover_Output/land_cover_${yearString}.png`;
    const bumpMapPath = `/SurfaceBumpData_HTML/globe_bump_${yearString}.png`;
    const atmosphereMapPath = `/NASA_Atmosphere_Output/year_average_${yearString}.png`;
    const cloudMapPath = `clouds_texture.jpg`;

    // Add state to handle texture loading errors gracefully
    const [textureLoadError, setTextureLoadError] = useState(false);

    const [colorMap, bumpMap, atmosphereMap, cloudMap] = useTexture([
        colorMapPath,
        bumpMapPath,
        atmosphereMapPath, cloudMapPath
    ], (textures) => {
        if (textures[1]) {
            textures[1].colorSpace = THREE.NoColorSpace;
        }
        setTextureLoadError(false); // Reset error state on successful load
    },
        (error) => {
            console.warn(`Earth texture loading failed for year ${currentYear}. Rendering solid color.`);
            setTextureLoadError(true);
        });

    useFrame(() => {
        if (earthRef.current) {
            // Earth's axial rotation
            earthRef.current.rotation.y += 0.02;
        }
        if (cloudsRef.current) {
            // Cloud layer rotation (slightly faster)
            cloudsRef.current.rotation.y += 0.025;
        }
        if (cloudTextureRef.current) {
            // Cloud texture layer rotation (slightly different speed)
            cloudTextureRef.current.rotation.y += 0.03;
        }
    });

    const getMaterialProps = (map, bump = false) => {
        // If texture failed to load, return an empty object, forcing the material to use solid color
        if (!map || textureLoadError) return {
        };
        return bump ? { bumpMap: map } : { map: map };
    };

    const getEarthMaterial = () => {
        return (
            <meshStandardMaterial

                color={0xFFFFFF}
                {...getMaterialProps(colorMap)}
                {...getMaterialProps(bumpMap, true)}
                bumpScale={100}
            />
        );
    };

    const getBumpMaterial = () => {
        // This mesh is the cloud layer that sits slightly above the main Earth mesh.
        return (
            <meshPhongMaterial
                {...getMaterialProps(bumpMap)}
                {...getMaterialProps(bumpMap, true)}
                bumpScale={100}
                color={0xFFFFFF}
            />
        );
    };

    const getCloudTextureMaterial = () => {
        return (
            <meshStandardMaterial
                map={cloudMap} // Use the atmosphere map for the cloud texture
                color={0xFFFFFF}
                transparent={true}
                opacity={0.8} // Visible clouds, slightly transparent
                blending={THREE.NormalBlending} // Standard blending for visible clouds
            />
        );
    };

    const getAtmosphereMaterial = () => {
        // This mesh is the cloud layer that sits slightly above the main Earth mesh.
        return (
            <meshPhongMaterial
                {...getMaterialProps(atmosphereMap)}
                color={0xFFFFFF}
                transparent={true}
                opacity={0.65}
                side={THREE.BackSide}
                blending={THREE.AdditiveBlending}
            />
        );
    };

    return (
        // Tilt the Earth on its axis (23.4 degrees)
        <group ref={earthGroupRef} rotation-z={-23.4 * Math.PI / 180}>

            {/* {!isFocused && (
    <Html position={[0, EARTH_SIZE + 0.5, 0]} center>
        <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.8rem',
            whiteSpace: 'nowrap',
            animation: 'pulse 1.5s infinite' // Optional: for attention
        }}>
            Click to Focus! 🖱️
        </div>
    </Html>
)}
    */}
            {dataType == 'earth' && (
                <>
                    {/* Main Earth Surface Mesh */}
                    <mesh ref={earthRef} position={[0, 0, 0]} onClick={onEarthClick}>
                        <sphereGeometry args={[EARTH_SIZE, 64, 64]} />
                        {getEarthMaterial()}
                    </mesh>
                    <mesh ref={cloudTextureRef} position={[0, 0, 0]} scale={2.006}>
                        <sphereGeometry args={[1, 64, 64]} />
                        {getCloudTextureMaterial()}
                    </mesh>
                    {/* atmosphere Layer Mesh */}
                    <mesh ref={cloudsRef} position={[0, 0, 0]} scale={2.05}>
                        <sphereGeometry args={[1, 64, 64]} />
                        {getAtmosphereMaterial()}
                    </mesh>
                </>
            )}

            {dataType == 'land' && (
                <>
                    {/* Main Earth Surface Mesh */}
                    <mesh ref={earthRef} position={[0, 0, 0]} onClick={onEarthClick}>
                        <sphereGeometry args={[EARTH_SIZE, 64, 64]} />
                        {getEarthMaterial()}
                    </mesh>

                </>
            )}

            {dataType == 'bump' && (
                <mesh ref={earthRef} position={[0, 0, 0]} onClick={onEarthClick}>
                    <sphereGeometry args={[EARTH_SIZE, 64, 64]} />
                    {getBumpMaterial()}
                </mesh>
            )}

            {dataType == 'atmosphere' && (
                <mesh ref={cloudsRef} position={[0, 0, 0]} scale={2.05} onClick={onEarthClick}>
                    <sphereGeometry args={[1, 64, 64]} />
                    {getAtmosphereMaterial()}
                </mesh>
            )}

            <MoonOrbitAnimator />
            <SatelliteOrbitAnimator />

        </group>
    );
}

/**
 * Encapsulates the Earth's orbital movement logic using useFrame and orbital tracking.
 */
function EarthOrbitAnimator({ currentYear, dataType, onOrbitComplete, onEarthPositionChange, onEarthClick, isFocused }) {
    const earthOrbitRef = useRef();
    const lastOrbitTime = useRef(0);
    const orbitCount = useRef(0);
    const localPosition = useRef(new THREE.Vector3());
    const worldPosition = useRef(new THREE.Vector3());

    // Create a Quaternion to represent the master group's tilt (around X-axis)
    const tiltQuaternion = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0), // Rotation around the X-axis
        ORBIT_TILT_Z
    );

    // Calculates elliptical orbit position and detects orbit completion
    useFrame(({ clock }) => {
        if (earthOrbitRef.current) {
            const currentSpeed = isFocused ? EARTH_FOCUSED_SPEED : EARTH_ORBIT_SPEED;
            const t = clock.getElapsedTime() * currentSpeed;

            // 1. Calculate the Earth's local position (in the untransformed XZ plane)
            const x = AU_DISTANCE * ORBIT_ECCENTRICITY * Math.cos(t);
            const z = AU_DISTANCE * ORBIT_ECCENTRICITY * Math.sin(t);

            // Apply local position to the Earth's orbital group
            earthOrbitRef.current.position.x = x;
            earthOrbitRef.current.position.z = z;

            // 2. Transform the local position to the world position

            // a. Store the local position vector (relative to the Sun/Origin)
            localPosition.current.set(x, 0, z);

            // b. Apply the master tilt (rotation-x) to the local vector
            // Note: The Sun_Shift_X is applied later in EarthGlobe for the final camera target.
            worldPosition.current.copy(localPosition.current).applyQuaternion(tiltQuaternion);

            // 3. Report the *rotated* position (relative to the tilted origin [0,0,0] which is the Sun center)
            if (onEarthPositionChange) {
                // Pass the rotated vector. The SUN_SHIFT_X will be added in EarthGlobe for the camera target.
                onEarthPositionChange(worldPosition.current);
            }

            // 4. Track orbit completion (when t completes a full 2π cycle)
            const currentOrbitTime = Math.floor(t / (2 * Math.PI));
            if (currentOrbitTime > lastOrbitTime.current) {
                lastOrbitTime.current = currentOrbitTime;
                orbitCount.current += 1;

                if (onOrbitComplete) {
                    onOrbitComplete(orbitCount.current);
                }
            }
        }
    });

    return (
        <group ref={earthOrbitRef}>
            <group position={[0, 0, 0]}>
                <Earth currentYear={currentYear}
                    dataType={dataType}
                    onEarthClick={onEarthClick}
                    isFocused={isFocused}
                />
            </group>
        </group>
    );
}
// function CameraFocusController({ targetPosition, isFocusedRef }) {
//     const controlsRef = useRef();
//     const { camera } = useThree();

//     useFrame(() => {
//         if (controlsRef.current) {
//             // Smoothly interpolate the controls target to the new position
//             controlsRef.current.target.lerp(targetPosition, 0.1); 
//             controlsRef.current.update();

//             // Optional: When focused, smoothly move the camera closer if it's too far
//             if (isFocusedRef.current) {
//                  // Define a target camera position closer to the Earth
//                  const targetCamPos = targetPosition.clone().add(new THREE.Vector3(5, 2, 5));
//                  const currentDistance = camera.position.distanceTo(targetPosition);

//                  // If current distance is too large, move camera closer for an initial 'zoom' feeling
//                  if (currentDistance > 10) {
//                      camera.position.lerp(targetCamPos, 0.05);
//                  }
//             } else {
//                 // If unfocused (on Sun), ensure camera is far enough to see the orbit
//                  const sunTarget = new THREE.Vector3(SUN_SHIFT_X, 0, 0);
//                  const currentDistance = camera.position.distanceTo(sunTarget);

//                  // If the camera is too close to the sun target, pull it back to the initial view distance
//                  if (currentDistance < 20) {
//                       camera.position.lerp(new THREE.Vector3(AU_DISTANCE + SUN_SHIFT_X + 1, 2, 5), 0.01);
//                  }
//             }
//         }
//     });

//     return (
//         <OrbitControls 
//             ref={controlsRef} // Get ref to controls
//             enableZoom={true} 
//             enablePan={false} 
//             maxDistance={AU_DISTANCE + 25}
//             minDistance={2} 
//             enableDamping={true} 
//             dampingFactor={0.05} 
//         />
//     );
// }

/**
 * Controls the camera's view: initial top-down, then switches to auto-follow.
 */
function CameraFocusController({ earthPosition, isFocused, controlsEnabled, setControlsEnabled, setIsFocused }) { //change: Added isFocused, setIsFocused
    const controlsRef = useRef();
    const isInitialView = useRef(true);
    const initialViewDuration = 5000;
    const { camera } = useThree(); //change: Get camera access

    // Default target is the Sun
    const SUN_TARGET = useMemo(() => new THREE.Vector3(SUN_SHIFT_X, 0, 0), []); //change: Defined SUN_TARGET

    // The target the camera controls will focus on (Sun or Earth)
    const controlsTarget = useRef(SUN_TARGET); //change: Renamed cameraTarget to controlsTarget

    useEffect(() => {
        const timer = setTimeout(() => {
            isInitialView.current = false;
        }, initialViewDuration);
        return () => clearTimeout(timer);
    }, []);

    // Monitor the focus state and smoothly adjust the camera position and distance
    useEffect(() => { //change: New useEffect for managing focus state changes
        if (isFocused) {
            // When focused, disable auto-follow and allow manual controls (but still focus on Earth)
            isInitialView.current = false;
        }
    }, [isFocused]);


    useFrame(({ clock }) => {
        if (controlsRef.current) {

            // 1. Determine the target based on the state
            const targetPosition = isFocused ? earthPosition : SUN_TARGET; //change: Target is Earth or Sun

            // Smoothly move the controls target
            controlsTarget.current.lerp(targetPosition, 0.1);

            // 2. Handle Auto-Follow (only when not explicitly focused and initial view is over)
            if (!isFocused && !isInitialView.current) { //change: Check both focus and initial view

                // Calculate trailing camera position (based on Earth's orbit)
                const t = clock.getElapsedTime() * EARTH_ORBIT_SPEED;
                const camX = AU_DISTANCE * 1.5 * Math.cos(t + Math.PI / 2);
                const camZ = AU_DISTANCE * 1.5 * Math.sin(t + Math.PI / 2);
                const targetCamPosition = new THREE.Vector3(camX + SUN_SHIFT_X, 8, camZ);

                // Smoothly move the camera
                camera.position.lerp(targetCamPosition, 0.01);

                controlsRef.current.minDistance = 2; // Keep min distance for orbit view
                controlsRef.current.maxDistance = AU_DISTANCE + 25;

            } else if (isFocused) { //change: Logic for when Earth is clicked (focused)

                // When focused, smoothly pull the camera closer for a zoom effect
                const currentDistance = camera.position.distanceTo(earthPosition);

                const targetZoomDistance = SAFE_ZOOM_DISTANCE; // A comfortable zoom distance

                if (currentDistance > targetZoomDistance * 1.05) {
                    // Create a target camera position vector that is closer to the earth
                    const direction = new THREE.Vector3().subVectors(camera.position, earthPosition).normalize();
                    const targetPosition = earthPosition.clone().add(direction.multiplyScalar(targetZoomDistance));
                    camera.position.lerp(targetPosition, 0.05);
                }

                // Allow much closer manual zoom when focused
                controlsRef.current.minDistance = SAFE_ZOOM_DISTANCE;
                controlsRef.current.maxDistance = AU_DISTANCE + 5; // Constrain max distance a bit
            }

            // 3. Update the controls target
            controlsRef.current.target.copy(controlsTarget.current);
            controlsRef.current.update();
        }
    });

    return (
        <OrbitControls
            ref={controlsRef}
            enabled={controlsEnabled}
            enableZoom={true}
            enablePan={true}
            maxDistance={AU_DISTANCE + 25}
            minDistance={2}
            enableDamping={true}
            dampingFactor={0.05}
            touch={{
                handleRotation: THREE.TOUCH.Rotate,
                handleZoom: THREE.TOUCH.DOLLY,
                handlePan: THREE.TOUCH.PAN
            }}
            // Disable initial view and focus on user interaction
            onStart={() => isInitialView.current = false}
            onEnd={() => setControlsEnabled(true)}
        />
    );
}



/**
 * Main application component.
 */
export default function EarthGlobe({ currentYear, dataType = 'earth', onOrbitComplete }) {

    // const defaultTarget = new THREE.Vector3(SUN_SHIFT_X, 0, 0);
    const [earthPosition, setEarthPosition] = useState(new THREE.Vector3(AU_DISTANCE * ORBIT_ECCENTRICITY + SUN_SHIFT_X, 0, 0));
    const [controlsEnabled, setControlsEnabled] = useState(true);
    const [isFocused, setIsFocused] = useState(false);

    const handleEarthPositionChange = (rotatedPosition) => {
       setEarthPosition(rotatedPosition.clone().add(new THREE.Vector3(SUN_SHIFT_X, 0, 0)));
    };

    const handleEarthClick = (event) => { 
        event.stopPropagation();
       setIsFocused(prev => !prev);
    };

    // --- Responsive Camera Setup ---
    const initialCameraSettings = useMemo(() => {
        const aspectRatio = window.innerWidth / window.innerHeight;
        const isMobilePortrait = aspectRatio < 1.0;

        return {
            // Initial position for top-down view
            position: [SUN_SHIFT_X, AU_DISTANCE + 5, 0],
            // Narrower FOV for mobile portrait to prevent distortion, wider for desktop
            fov: isMobilePortrait ? 70 : 50,
        };
    }, []);


    return (
        <Canvas
            camera={initialCameraSettings}
            style={{ background: '#000000', width: '100vw', height: '100vh' }}
        >
            <Suspense fallback={<Html center className="text-white">Loading Solar System Data...</Html>}>

                {/* Master group to tilt the entire solar system plane */}
                <group rotation-x={ORBIT_TILT_Z}>
                    <Sun />
                    <OrbitLine />
                    <EarthOrbitAnimator
                        currentYear={currentYear}
                        dataType={dataType}
                        onOrbitComplete={onOrbitComplete}
                        onEarthPositionChange={handleEarthPositionChange}
                        onEarthClick={handleEarthClick}
                        isFocused={isFocused} />
                </group>


                <ambientLight intensity={0.5} />

                <Stars radius={200} depth={100} count={10000} factor={8} saturation={0.8} fade speed={1.5} />

                <CameraFocusController
                    earthPosition={earthPosition}
                    isFocused={isFocused}
                    setIsFocused={setIsFocused}
                    controlsEnabled={controlsEnabled}
                    setControlsEnabled={setControlsEnabled}
                />
            </Suspense>
        </Canvas>
    );
}
