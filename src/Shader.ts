import glUtils from './utils/glUtils'
import Model from './Model'

export class Shader {
  gl: WebGL2RenderingContext
  program: WebGLProgram
  isEdge: boolean
  uniformList: { [name: string]: { loc: WebGLUniformLocation; type: string } }
  textureList: { loc: WebGLUniformLocation | null; tex: WebGLTexture | null }[]

  constructor(gl: WebGL2RenderingContext, vs: string, fs: string) {
    this.gl = gl
    this.program = glUtils(gl).createProgramShader(vs, fs)
    this.isEdge = true
    this.uniformList = {}
    this.textureList = []

    //set uniform location
    this.prepareUniforms(
      'mMatrix',
      'mat4',
      'vMatrix',
      'mat4',
      'pMatrix',
      'mat4',
      'invMatrix',
      'mat4',
      'edge',
      '1f'
    )
  }

  prepareUniforms(...params: string[]) {
    if (params.length % 2 != 0) {
      console.log('prepareUniforms needs arguments to be in pairs.')
      return this
    }

    let loc
    for (let i = 0; i < params.length; i += 2) {
      loc = this.gl.getUniformLocation(this.program, params[i])
      if (loc != null) this.uniformList[params[i]] = { loc: loc, type: params[i + 1] }
    }

    return this
  }

  async loadTextures(...params: string[]) {
    if (params.length % 2 != 0) {
      console.log('prepareTextures needs arguments to be in pairs.')
      return this
    }

    let loc: WebGLUniformLocation | null
    let src: string
    for (let i = 0; i < params.length; i += 2) {
      loc = this.gl.getUniformLocation(this.program, params[i])
      src = params[i + 1]

      await glUtils(this.gl)
        .loadTexture(src)
        .then((res) => {
          this.textureList.push({ loc: loc, tex: res })
        })
    }

    return this
  }

  setUniforms(...params: (string | number | number[])[]) {
    if (params.length % 2 != 0) {
      console.log('setUniforms needs params to be in pairs.')
      return this
    }

    let name, val: any

    for (let i = 0; i < params.length; i += 2) {
      name = params[i]
      val = params[i + 1]

      if (typeof name !== 'string') {
        console.log('params shoud be orderring (name, value...).')
        return this
      }

      if (this.uniformList[name] === undefined) {
        console.log('uniform not found ' + name)
        return this
      }

      switch (this.uniformList[name].type) {
        case '1f':
          this.gl.uniform1f(this.uniformList[name].loc, val)
          break
        case '1fv':
          this.gl.uniform1fv(this.uniformList[name].loc, val)
          break
        case '2fv':
          this.gl.uniform2fv(this.uniformList[name].loc, val)
          break
        case '3fv':
          this.gl.uniform3fv(this.uniformList[name].loc, val)
          break
        case '4fv':
          this.gl.uniform4fv(this.uniformList[name].loc, val)
          break
        case 'mat4':
          this.gl.uniformMatrix4fv(this.uniformList[name].loc, false, val)
          break
        default:
          console.log('unknown uniform type for ' + name)
          break
      }
    }

    return this
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

  //...................................................
  preRender() {
    //set textures
    this.gl.useProgram(this.program)

    if (this.textureList.length > 0) {
      for (let i = 0; i < this.textureList.length; i++) {
        const slot = this.gl.TEXTURE0 + i

        this.gl.activeTexture(slot)
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureList[i].tex)
        this.gl.uniform1i(this.textureList[i].loc, i)
      }
    }

    return this
  }

  renderModel(model: Model) {
    // set mMatrix x bone
    this.setUniforms('mMatrix', model.transform.getMatrix(), 'invMatrix', model.transform.getInvMatrix())

    if (model.armature && model.attribute.bon && model.attribute.wei) {
      model.armature.orderedJoints.forEach((bone: any, index: number) => {
        let bones = this.gl.getUniformLocation(this.program, `bones[${index}]`)
        this.gl.uniformMatrix4fv(bones, false, bone.offsetMat)
      })
    }

    // bind and draw
    this.gl.bindVertexArray(model.vao)

    // model
    this.gl.cullFace(this.gl.BACK)
    this.setUniforms('edge', 0)
    this.gl.drawElements(this.gl.TRIANGLES, model.attribute.inx.length, this.gl.UNSIGNED_SHORT, 0)

    // edge
    if (this.isEdge) {
      this.gl.cullFace(this.gl.FRONT)
      this.setUniforms('edge', 1)
      this.gl.drawElements(this.gl.TRIANGLES, model.attribute.inx.length, this.gl.UNSIGNED_SHORT, 0)
    }

    //unbind
    this.gl.bindVertexArray(null)
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)

    return this
  }
}
