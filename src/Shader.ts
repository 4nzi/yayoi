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
  invLocation: WebGLUniformLocation | null
  edgeLocation: WebGLUniformLocation | null
  lightLocation: WebGLUniformLocation | null
  colorLocation: WebGLUniformLocation | null
  albedoTexLocation: WebGLUniformLocation | null
  normalTexLocation: WebGLUniformLocation | null
  texture: {
    albedo: WebGLTexture | null
    normal: WebGLTexture | null
  }

  constructor(gl: WebGL2RenderingContext, vs: string, fs: string) {
    super(gl, vs, fs)

    //custom uniforms
    this.invLocation = gl.getUniformLocation(this.program, 'invMatrix')
    this.edgeLocation = gl.getUniformLocation(this.program, 'edge')
    this.lightLocation = gl.getUniformLocation(this.program, 'lightPosition')
    this.colorLocation = gl.getUniformLocation(this.program, 'color')
    this.albedoTexLocation = gl.getUniformLocation(this.program, 'albedoTex')
    this.normalTexLocation = gl.getUniformLocation(this.program, 'normalTex')

    //store texture
    this.texture = {
      albedo: null,
      normal: null,
    }
  }

  setLightPosition(vec: number[]) {
    this.gl.uniform3fv(this.lightLocation, vec)
    return this
  }

  setInvMatrix(mat: number[]) {
    this.gl.uniformMatrix4fv(this.invLocation, false, mat)
    return this
  }

  setColor(vec: number[]) {
    this.gl.uniform3fv(this.colorLocation, vec)
    return this
  }

  setAlbedoTexture(tex: WebGLTexture | null) {
    this.texture.albedo = tex
    return this
  }
  setNormalTexture(tex: WebGLTexture | null) {
    this.texture.normal = tex
    return this
  }

  //...................................................
  preRender() {
    // bind texture
    if (this.texture.albedo) {
      this.gl.activeTexture(this.gl.TEXTURE0)
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.albedo)
      this.gl.uniform1i(this.albedoTexLocation, 0)
    }

    if (this.texture.normal) {
      this.gl.activeTexture(this.gl.TEXTURE1)
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.normal)
      this.gl.uniform1i(this.normalTexLocation, 1)
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
    this.gl.uniform1i(this.edgeLocation, 0)
    this.gl.drawElements(this.gl.TRIANGLES, model.attribute.inx.length, this.gl.UNSIGNED_SHORT, 0)

    // edge
    this.gl.cullFace(this.gl.FRONT)
    this.gl.uniform1i(this.edgeLocation, 1)
    this.gl.drawElements(this.gl.TRIANGLES, model.attribute.inx.length, this.gl.UNSIGNED_SHORT, 0)

    // unbind
    this.gl.bindVertexArray(null)
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)

    return this
  }
}
