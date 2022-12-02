import glUtils from './utils/glUtils'
import Transform from './Transform'
import { MESH, ATTRIBUTE, SCENE } from './types'

export default class Model {
  gl: WebGL2RenderingContext
  attribute: ATTRIBUTE
  vao: WebGLVertexArrayObject | null
  transform: Transform
  shaderIdx: number
  scene: SCENE
  id: number

  constructor(mesh: MESH, gl: WebGL2RenderingContext) {
    this.gl = gl
    this.attribute = mesh.attribute
    this.shaderIdx = -1
    this.transform = new Transform()
    this.vao = glUtils(this.gl).createVAO(
      this.attribute.pos,
      this.attribute.inx,
      this.attribute.nor,
      this.attribute.uv,
      this.attribute.wei,
      this.attribute.bon
    )
    this.scene = {
      translation: mesh.scene.translation,
      rotation: mesh.scene.rotation,
      scale: mesh.scene.scale,
    }
    this.id = mesh.id
  }

  setShader(shaderInx: number) {
    this.shaderIdx = shaderInx
    return this
  }

  // transform operation
  setScale(x: number, y: number, z: number) {
    this.transform.scale = [x, y, z]
    return this
  }
  setPosition(x: number, y: number, z: number) {
    this.transform.position = [x, y, z]
    return this
  }
  setRotation(x: number, y: number, z: number) {
    this.transform.rotation = [x, y, z]
    return this
  }
  addScale(x: number, y: number, z: number) {
    this.transform.scale[0] += x
    this.transform.scale[1] += y
    this.transform.scale[2] += z
    return this
  }
  addPosition(x: number, y: number, z: number) {
    this.transform.position[0] += x
    this.transform.position[1] += y
    this.transform.position[2] += z
    return this
  }
  addRotation(x: number, y: number, z: number) {
    this.transform.rotation[0] += x
    this.transform.rotation[1] += y
    this.transform.rotation[2] += z
    return this
  }

  // preRender
  preRender() {
    // set world TRS
    this.setPosition(this.scene.translation[0], this.scene.translation[1], this.scene.translation[2])
    this.setScale(this.scene.scale[0], this.scene.scale[1], this.scene.scale[2])
    this.transform.updateMatrix()

    return this
  }
}
