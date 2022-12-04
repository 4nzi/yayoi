import Model from './Model'
import { ToonShader } from './Shader'
import { Camera, CameraController } from './Camera'
import Scene from './Scene'
import RenderLoop from './RenderLoop'
import parseGLB from './utils/parseGLB'
import { MESH, SETTING } from './types'
import vFill from './shaders/fill/vertexShader.glsl'
import fFill from './shaders/fill/fragmentShader.glsl'
import vTex from './shaders/tex/vertexShader.glsl'
import fTex from './shaders/tex/fragmentShader.glsl'

export default class Yayoi {
  gl: WebGL2RenderingContext
  shaders: any[]

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl
    this.shaders = []
  }

  async loadGLB(src: string, callback: (meshes: any) => void) {
    const res = await (await fetch(src)).blob()
    const reader = new FileReader()

    reader.readAsArrayBuffer(res)
    reader.onload = () => {
      callback(parseGLB(reader.result))
    }
  }

  model(mesh: MESH, shader: any) {
    const model = new Model(mesh, this.gl)
    const shaderInx = this.shaders.indexOf(shader)

    if (shaderInx == -1) {
      this.shaders.push(shader)
      model.setShader(this.shaders.length - 1)
    } else model.setShader(shaderInx)

    return model
  }

  shader(setting: SETTING) {
    let shader

    if (typeof setting.albedo == 'string') {
      shader = new ToonShader(this.gl, vTex, fTex)
      shader.loadAlbedoTexture(setting.albedo)
    } else if (setting.albedo instanceof Array && setting.albedo.length == 3) {
      shader = new ToonShader(this.gl, vFill, fFill)
      shader.activate().setColor(setting.albedo).deactivate()
    } else return console.warn('Invalid value')

    shader
      .activate()
      .setSdwThreshold(setting.sdwThreshold || 0.5)
      .setHiThreshold(setting.hiThreshold || 0.5)
      .setRimThreshold(setting.rimThreshold || 1.0)
      .setLightPosition(setting.mainLight || [0.5, 0.5, 0.1])
      .setEdgeWidth(setting.edgeWidth || 0.03)
      .deactivate()

    return shader
  }

  scene() {
    return new Scene()
  }

  camera() {
    const camera = new Camera(this.gl)
    const CameraCtrl = new CameraController(this.gl, camera)
    camera.transform.position = [0.0, 0.0, 5.0]

    return camera
  }

  render(scene: Scene, camera: Camera, fps: 30) {
    // setting
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.depthFunc(this.gl.LEQUAL)
    this.gl.enable(this.gl.CULL_FACE)

    // set uniform
    this.shaders.forEach((shader) => shader.activate().setPmatrix(camera.pMatrix).deactivate())

    const onRender = () => {
      // clear
      this.gl.clearColor(0.3, 0.3, 0.3, 1.0)
      this.gl.clearDepth(1.0)
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

      // draw models x update matrix
      camera.updateViewMatrix()

      scene.models.forEach((model) => {
        this.shaders[model.shaderIdx]
          .activate()
          .preRender()
          .setVmatrix(camera.vMatrix)
          .setEyePosition(camera.transform.getPosition())
          .renderModel(model.preRender())
      })
    }

    const RLoop = new RenderLoop(onRender, fps)

    return RLoop
  }
}
