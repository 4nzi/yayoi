import RenderLoop from './RenderLoop'
import { Camera, CameraController } from './Camera'
import { Shader } from './Shader'
import Model from './Model'
import { MESH } from './types'
import vs from './shaders/cray/vertexShader.glsl'
import fs from './shaders/cray/fragmentShader.glsl'

export default class Yayoi {
  gl: WebGL2RenderingContext
  shaders: Shader[]

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl
    this.shaders = []
  }

  shader() {
    return new Shader(this.gl, vs, fs)
  }

  model(mesh: MESH, shader: Shader) {
    const model = new Model(mesh, this.gl)
    const index = this.shaders.indexOf(shader)

    if (index == -1) {
      this.shaders.push(shader)
      model.setShader(this.shaders.length - 1)
    } else model.setShader(index)

    return model
  }

  camera() {
    const camera = new Camera(this.gl)
    const CameraCtrl = new CameraController(this.gl, camera)
    camera.transform.position = [0.0, 0.0, 5.0]

    return camera
  }

  render(model: Model, camera: Camera) {
    // setting
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.depthFunc(this.gl.LEQUAL)
    this.gl.enable(this.gl.CULL_FACE)

    this.shaders[model.shaderIdx].activate().setPmatrix(camera.pMatrix).deactivate()

    const onRender = () => {
      // clear
      this.gl.clearColor(0.3, 0.3, 0.3, 1.0)
      this.gl.clearDepth(1.0)
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

      camera.updateViewMatrix()

      // draw models
      this.shaders[model.shaderIdx].activate().setVmatrix(camera.vMatrix).renderModel(model.preRender())
    }

    const RLoop = new RenderLoop(onRender, 30)

    return RLoop
  }
}
