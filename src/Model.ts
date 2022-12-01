import glUtils from './utils/glUtils'
import Transform from './Transform'
import { MESH, ATTRIBUTE } from './types'

export default class Model {
  gl: WebGL2RenderingContext
  attribute: ATTRIBUTE
  vao: WebGLVertexArrayObject | null
  transform: Transform
  shaderIdx: number

  constructor(meshData: MESH, gl: WebGL2RenderingContext) {
    this.gl = gl
    this.attribute = meshData.attribute

    this.vao = glUtils(this.gl).createVAO(this.attribute.pos, this.attribute.inx)

    this.transform = new Transform() // include model matrix
    this.shaderIdx = -1
  }

  setShader(shaderInx: number) {
    this.shaderIdx = shaderInx
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
    this.transform.updateMatrix()

    return this
  }
}
