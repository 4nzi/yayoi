import glUtils from './utils/glUtils'
import Model from './Model'

export class Shader {
  gl: WebGL2RenderingContext
  program: WebGLProgram
  attLocation: {
    position: WebGLUniformLocation | null
    normal: WebGLUniformLocation | null
    uv: WebGLUniformLocation | null
  }
  uniLocation: {
    mMatrix: WebGLUniformLocation | null
    vMatrix: WebGLUniformLocation | null
    pMatrix: WebGLUniformLocation | null
  }

  constructor(gl: WebGL2RenderingContext, vs: string, fs: string) {
    this.gl = gl
    this.program = glUtils(gl).createProgramShader(vs, fs)
    this.attLocation = glUtils(gl).getStandardAttLocations(this.program)
    this.uniLocation = glUtils(gl).getStandardUniLocations(this.program)
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

  //...................................................
  preRender() {}

  renderModel(model: Model) {
    //register uniform
    this.setMmatrix(model.transform.getMatrix())

    //draw
    this.gl.bindVertexArray(model.vao)
    this.gl.drawElements(this.gl.TRIANGLES, model.attribute.inx.length, this.gl.UNSIGNED_SHORT, 0)
    this.gl.bindVertexArray(null)

    return this
  }
}

export class ToonShader extends Shader {
  invMatrix: WebGLUniformLocation | null
  lightPosition: WebGLUniformLocation | null
  eyePosition: WebGLUniformLocation | null
  color: WebGLUniformLocation | null
  sdwThreshold: WebGLUniformLocation | null
  hiThreshold: WebGLUniformLocation | null
  rimThreshold: WebGLUniformLocation | null
  edge: WebGLUniformLocation | null
  edgeWidth: WebGLUniformLocation | null
  albedoTex: WebGLUniformLocation | null
  normalTex: WebGLUniformLocation | null
  texture: {
    albedo: WebGLTexture | null
    normal: WebGLTexture | null
  }

  constructor(gl: WebGL2RenderingContext, vs: string, fs: string) {
    super(gl, vs, fs)
    //custom uniforms
    this.invMatrix = gl.getUniformLocation(this.program, 'invMatrix')
    this.lightPosition = gl.getUniformLocation(this.program, 'lightPosition')
    this.eyePosition = gl.getUniformLocation(this.program, 'eyePosition')
    this.sdwThreshold = gl.getUniformLocation(this.program, 'sdwThreshold')
    this.hiThreshold = gl.getUniformLocation(this.program, 'hiThreshold')
    this.rimThreshold = gl.getUniformLocation(this.program, 'rimThreshold')
    this.color = gl.getUniformLocation(this.program, 'color')
    this.albedoTex = gl.getUniformLocation(this.program, 'albedoTex')
    this.normalTex = gl.getUniformLocation(this.program, 'normalTex')
    this.edge = gl.getUniformLocation(this.program, 'edge')
    this.edgeWidth = gl.getUniformLocation(this.program, 'edgeWidth')

    //store texture
    this.texture = {
      albedo: null,
      normal: null,
    }
  }

  setLightPosition(vec: number[]) {
    this.gl.uniform3fv(this.lightPosition, vec)
    return this
  }

  setEyePosition(vec: number[]) {
    this.gl.uniform3fv(this.eyePosition, vec)
    return this
  }

  setInvMatrix(mat: number[]) {
    this.gl.uniformMatrix4fv(this.invMatrix, false, mat)
    return this
  }

  setColor(vec: number[]) {
    this.gl.uniform3fv(this.color, vec)
    return this
  }

  setEdgeWidth(val: number) {
    this.gl.uniform1f(this.edgeWidth, val)
    return this
  }

  setSdwThreshold(val: number) {
    this.gl.uniform1f(this.sdwThreshold, val)
    return this
  }

  setHiThreshold(val: number) {
    this.gl.uniform1f(this.hiThreshold, val)
    return this
  }

  setRimThreshold(val: number) {
    this.gl.uniform1f(this.rimThreshold, val)
    return this
  }

  async loadAlbedoTexture(src: string) {
    await glUtils(this.gl)
      .loadTexture(src)
      .then((res) => (this.texture.albedo = res))
    return this
  }

  //...................................................
  preRender() {
    // bind texture
    if (this.texture.albedo) {
      this.gl.activeTexture(this.gl.TEXTURE0)
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.albedo)
      this.gl.uniform1i(this.albedoTex, 0)
    }

    if (this.texture.normal) {
      this.gl.activeTexture(this.gl.TEXTURE1)
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.normal)
      this.gl.uniform1i(this.normalTex, 1)
    }

    return this
  }

  renderModel(model: Model) {
    // register matrix
    this.setMmatrix(model.transform.getMatrix())
    this.setInvMatrix(model.transform.getInvMatrix())

    // bind and draw
    this.gl.bindVertexArray(model.vao)

    // model
    this.gl.cullFace(this.gl.BACK)
    this.gl.uniform1i(this.edge, 0)
    this.gl.drawElements(this.gl.TRIANGLES, model.attribute.inx.length, this.gl.UNSIGNED_SHORT, 0)

    // edge
    this.gl.cullFace(this.gl.FRONT)
    this.gl.uniform1i(this.edge, 1)
    this.gl.drawElements(this.gl.TRIANGLES, model.attribute.inx.length, this.gl.UNSIGNED_SHORT, 0)

    // unbind
    this.gl.bindVertexArray(null)
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)

    return this
  }
}
