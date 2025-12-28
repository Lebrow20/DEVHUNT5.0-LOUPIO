import React, { useEffect, useRef, useMemo } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'

export function Model(props) {
  const group = useRef()
  const { scene, animations } = useGLTF('/scene.gltf')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions } = useAnimations(animations, group)

  // ▶️ Lance la première animation trouvée
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = Object.values(actions)[0]
      firstAction.play()
    }
  }, [actions])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]} scale={2.349}>
          <group name="Tom_Body_Default_(merge)fbx" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="Tom_Body_Default_(merge)">
                  <group name="Tom_Body_Default">
                    <group name="eyes" position={[-2.905, 28.924, 62.11]} />
                    <group name="body" position={[-2.905, 28.924, 62.11]} />
                  </group>
                  <group name="TomAdult">
                    <group name="Object_9">
                      <primitive object={nodes._rootJoint} />
                      <group name="Object_12" />
                      <group name="C_skin_meshes__SET">
                        <group name="bodyOld" />
                        <group name="eyesOld" />
                        <group name="teethTongueOld" />
                      </group>
                      <skinnedMesh name="Object_11" geometry={nodes.Object_11.geometry} material={materials.MAT_body} skeleton={nodes.Object_11.skeleton} />
                      <skinnedMesh name="Object_13" geometry={nodes.Object_13.geometry} material={materials.MAT_eyes} skeleton={nodes.Object_13.skeleton} />
                      <skinnedMesh name="Object_14" geometry={nodes.Object_14.geometry} material={materials.MAT_body} skeleton={nodes.Object_14.skeleton} />
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/scene.gltf')
