import glUtils from './utils/glUtils'
import Model from './Model'

export class Shader {
  gl: WebGL2RenderingContext
  program: WebGLProgram
  attLocation: { position: number }
  uniLocation: {
    mMatrix: WebGLUniformLocation | null
    vMatrix: WebGLUniformLocation | null
    pMatrix: WebGLUniformLocation | null
    invMatrix: WebGLUniformLocation | null
    lightDirection: WebGLUniformLocation | null
  }
  texLocation: {}

  constructor(gl: WebGL2RenderingContext, vs: string, fs: string) {
    this.program = glUtils(gl).createProgramShader(vs, fs)
    this.gl = gl

    gl.useProgram(this.program)

    this.attLocation = glUtils(gl).getStandardAttLocations(this.program)
    this.uniLocation = glUtils(gl).getStandardUniLocations(this.program)
    this.texLocation = {}
  }

  activate() {
    this.gl.useProgram(this.program)
    return this
  }

  deactivate() {
    this.gl.useProgram(null)
    return this
  }

  dispose() {
    if (this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program) this.gl.useProgram(null)
    this.gl.deleteProgram(this.program)
  }

  setMmatrix(mat: number[]) {
    this.gl.uniformMatrix4fv(this.uniLocation.mMatrix, false, mat)
    return this
  }
  setVmatrix(mat: number[]) {
    this.gl.uniformMatrix4fv(this.uniLocation.vMatrix, false, mat)
    return this
  }
  setPmatrix(mat: number[]) {
    this.gl.uniformMatrix4fv(this.uniLocation.pMatrix, false, mat)
    return this
  }
  setInvMatrix(mat: number[]) {
    this.gl.uniformMatrix4fv(this.uniLocation.invMatrix, false, mat)
    return this
  }

  //...................................................
  preRender() {}

  renderModel(model: Model) {
    //register uniform
    this.setMmatrix(model.transform.getMatrix())
    this.setInvMatrix(model.transform.getInvMatrix())

    //draw
    this.gl.bindVertexArray(model.vao)
    this.gl.drawElements(this.gl.TRIANGLES, model.attribute.inx.length, this.gl.UNSIGNED_SHORT, 0)
    this.gl.bindVertexArray(null)

    return this
  }
}
