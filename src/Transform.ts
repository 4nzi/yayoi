import { matIV } from './utils/minMatrix'

const m = new matIV()

export default class Transform {
  static deg2Rad: number
  position: Array<number>
  scale: Array<number>
  rotation: Array<number>
  matrix: Array<number>
  invMatrix: Array<number>
  forward: Array<number>
  up: Array<number>
  right: Array<number>

  constructor() {
    this.position = [0, 0, 0]
    this.scale = [1, 1, 1]
    this.rotation = [0, 0, 0]
    this.matrix = m.identity(m.create())
    this.invMatrix = m.identity(m.create())

    this.forward = m.identity(m.create())
    this.up = m.identity(m.create())
    this.right = m.identity(m.create())
  }

  //--------------------------------------------------------------------------
  updateMatrix() {
    m.identity(this.matrix)
    m.translate(this.matrix, this.position, this.matrix)
    m.rotate(this.matrix, this.rotation[0] * Transform.deg2Rad, [1.0, 0.0, 0.0], this.matrix)
    m.rotate(this.matrix, this.rotation[1] * Transform.deg2Rad, [0.0, 1.0, 0.0], this.matrix)
    m.rotate(this.matrix, this.rotation[2] * Transform.deg2Rad, [0.0, 0.0, 1.0], this.matrix)
    m.scale(this.matrix, this.scale, this.matrix)

    m.inverse(this.matrix, this.invMatrix)

    m.translate(this.matrix, [0.0, 0.0, 1.0], this.forward)
    m.translate(this.matrix, [0.0, 1.0, 0.0], this.up)
    m.translate(this.matrix, [1.0, 0.0, 0.0], this.right)

    return this.matrix
  }

  updateDirection() {
    m.translate(this.matrix, [0.0, 0.0, 1.0], this.forward)
    m.translate(this.matrix, [0.0, 1.0, 0.0], this.up)
    m.translate(this.matrix, [1.0, 0.0, 0.0], this.right)

    return this
  }

  getMatrix() {
    return this.matrix
  }
  getInvMatrix() {
    return this.invMatrix
  }

  reset() {
    this.position = [0, 0, 0]
    this.scale = [1, 1, 1]
    this.rotation = [0, 0, 0]
  }
}

// cache
Transform.deg2Rad = Math.PI / 180
