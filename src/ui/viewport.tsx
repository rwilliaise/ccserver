import React from 'react'
import { PureComponent } from 'react'
import { Canvas } from 'react-three-fiber'

export class Viewport extends PureComponent {
  render(): React.ReactNode {
    return (
      <Canvas shadowMap>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <color attach={'background'} args={['white']} />
        <ambientLight intensity={0.4} />
      </Canvas>
    )
  }
}
