import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, AccumulativeShadows, RandomizedLight, Decal, Environment, Center } from '@react-three/drei'
import { easing } from 'maath'
import { useSnapshot } from 'valtio'
import { state } from './store'
import { TextureLoader } from 'three'
import { useDispatch } from 'react-redux'
import { proxyImage } from '../../../actions/userAction'

export const App = ({ position = [0, 0, 2.5], fov = 25, imageUrl }) => {
  return (
    <Canvas shadows camera={{ position, fov }} gl={{ preserveDrawingBuffer: true }} eventSource={document.getElementById('root')} eventPrefix="client">
      <ambientLight intensity={0.5} />
      <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/potsdamer_platz_1k.hdr" />
      <CameraRig>
        <Backdrop />
        <Center>
          <Shirt imageUrl={imageUrl} />
        </Center>
      </CameraRig>
    </Canvas>
  )
}

function Backdrop() {
  const shadows = useRef()
  useFrame((state, delta) => easing.dampC(shadows.current.getMesh().material.color, state.color, 0.25, delta))
  return (
    <AccumulativeShadows ref={shadows} temporal frames={60} alphaTest={0.85} scale={10} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.14]}>
      <RandomizedLight amount={4} radius={9} intensity={0.55} ambient={0.25} position={[5, 5, -10]} />
      <RandomizedLight amount={4} radius={5} intensity={0.25} ambient={0.55} position={[-5, 5, -9]} />
    </AccumulativeShadows>
  )
}

function CameraRig({ children }) {
  const group = useRef()
  const snap = useSnapshot(state)
  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [snap.intro ? -state.viewport.width / 4 : 0, 0, 2], 0.25, delta)
    easing.dampE(group.current.rotation, [state.pointer.y / 10, -state.pointer.x / 5, 0], 0.25, delta)
  })
  return <group ref={group}>{children}</group>
}

function Shirt(props) {
  console.log(props.imageUrl)
  const dispatch = useDispatch();
  const snap = useSnapshot(state)
  const [texture, setTexture] = useState(null);
  const [loadingError, setLoadingError] = useState(false);
  // const texture = useTexture(props.generatedDesign || `/${snap.decal}.png`)
  const loader = useRef(new TextureLoader());

  useEffect(() => {
    const downloadImage = async () => {
      try {
        const res = await dispatch(proxyImage(props.imageUrl));
        console.log(res)
        loader.current.load(
          res,
          (loadedTexture) => {
            setTexture(loadedTexture);
          },
          undefined,
          (error) => {
            console.error('Error loading texture:', error);
            setLoadingError(true);
          }
        );
      } catch (error) {
        console.error('Error downloading image:', error);
        setLoadingError(true);
      }
    };

    if (props.imageUrl) {
      downloadImage();
    }
  }, [props.imageUrl, dispatch]);

  const { nodes, materials } = useGLTF('/shirt_baked_collapsed.glb')
  useFrame((state, delta) => easing.dampC(materials.lambert1.color, snap.color, 0.25, delta))

  if (loadingError) {
    return <></>; // Render nothing if there's an error loading the texture
  }
  return (
    <mesh castShadow geometry={nodes.T_Shirt_male.geometry} material={materials.lambert1} material-roughness={1} {...props} dispose={null}>
      {texture && <Decal position={[0, 0.02, 0.10]} rotation={[0, 0, 0]} scale={0.20} map={texture} />}
    </mesh>
  )
}

useGLTF.preload('/shirt_baked_collapsed.glb')
  ;['/react.png', '/three2.png', '/pmndrs.png'].forEach(useTexture.preload)
