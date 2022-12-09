import Model from './Model'
import { Shader } from './Shader'
import { Camera, CameraController } from './Camera'
import Scene from './Scene'
import Armature from './Armature'
import RenderLoop from './RenderLoop'
import parseGLB from './utils/parseGLB'
import { MESH, SETTING } from './types'
import vFill from './shaders/fill/vertexShader.glsl'
import fFill from './shaders/fill/fragmentShader.glsl'
import vTex from './shaders/tex/vertexShader.glsl'
import fTex from './shaders/tex/fragmentShader.glsl'
import vSkin from './shaders/skin/vertexShader.glsl'

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

    if (Array.isArray(setting.albedo)) {
      shader = new Shader(this.gl, vFill, fFill)
      shader.activate().prepareUniforms('color', '3fv').setUniforms('color', setting.albedo).deactivate()
    } else if (setting.skinning) {
      shader = new Shader(this.gl, vSkin, fTex)
      shader.loadTextures('albedo', setting.albedo)
      shader
        .activate()
        .prepareUniforms(
          'lightPosition',
          '3fv',
          'eyePosition',
          '3fv',
          'sdwThreshold',
          '1f',
          'hiThreshold',
          '1f',
          'rimThreshold',
          '1f',
          'edgeWidth',
          '1f'
        )
        .setUniforms(
          'sdwThreshold',
          setting.sdwThreshold || 0.5,
          'hiThreshold',
          setting.hiThreshold || 0.5,
          'rimThreshold',
          setting.rimThreshold || 1.0,
          'lightPosition',
          setting.mainLight || [0.5, 0.5, 0.1],
          'edgeWidth',
          setting.edgeWidth || 0.03
        )
        .deactivate()
    } else {
      shader = new Shader(this.gl, vTex, fTex)
      shader.loadTextures('albedo', setting.albedo)
      shader
        .activate()
        .prepareUniforms(
          'lightPosition',
          '3fv',
          'eyePosition',
          '3fv',
          'sdwThreshold',
          '1f',
          'hiThreshold',
          '1f',
          'rimThreshold',
          '1f',
          'edgeWidth',
          '1f'
        )
        .setUniforms(
          'sdwThreshold',
          setting.sdwThreshold || 0.5,
          'hiThreshold',
          setting.hiThreshold || 0.5,
          'rimThreshold',
          setting.rimThreshold || 1.0,
          'lightPosition',
          setting.mainLight || [0.5, 0.5, 0.1],
          'edgeWidth',
          setting.edgeWidth || 0.03
        )
        .deactivate()
    }
    return shader
  }

  scene() {
    return new Scene()
  }

  armature() {
    return new Armature()
  }

  camera(pos: number[] = [0, 0, 10], fov: number) {
    const camera = new Camera(this.gl, fov)
    const CameraCtrl = new CameraController(this.gl, camera)
    camera.transform.position = pos

    return camera
  }

  render(scene: Scene, camera: Camera, fps: number) {
    const rgba = scene.environment
    // setting
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.depthFunc(this.gl.LEQUAL)
    this.gl.enable(this.gl.CULL_FACE)

    // set pMatrix
    this.shaders.forEach((shader) => shader.activate().setUniforms('pMatrix', camera.pMatrix).deactivate())

    const onRender = () => {
      // clear
      this.gl.clearColor(rgba[0], rgba[1], rgba[2], rgba[3])
      this.gl.clearDepth(1.0)
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

      // update
      camera.updateViewMatrix()

      // draw models
      scene.models.forEach((model) => {
        if (model.armature?.animations) {
          model.armature.playAnimation()
        }

        this.shaders[model.shaderInx]
          .activate()
          .preRender()
          .setUniforms('vMatrix', camera.vMatrix, 'eyePosition', camera.transform.getPosition())
          .renderModel(model.preRender())
      })
    }

    const RLoop = new RenderLoop(onRender, fps)

    return RLoop
  }
}
