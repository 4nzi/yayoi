const ATTR_POSITION_NAME = 'position'
const ATTR_POSITION_LOC = 0
const ATTR_POSITION_STR = 3
const ATTR_NORMAL_NAME = 'normal'
const ATTR_NORMAL_LOC = 1
const ATTR_NORMAL_STR = 3
const ATTR_UV_NAME = 'uv'
const ATTR_UV_LOC = 2
const ATTR_UV_STR = 2
const ATTR_WEIGHTS_NAME = 'weights'
const ATTR_WEIGHTS_LOC = 3
const ATTR_WEIGHTS_STR = 4
const ATTR_BONEIDX_NAME = 'boneIdx'
const ATTR_BONEIDX_LOC = 4
const ATTR_BONEIDX_STR = 4

const glUtils = (webglContext: WebGL2RenderingContext) => {
  const gl = webglContext

  const createShader = (source: string, type: number) => {
    const shader: any = gl.createShader(type)

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return
    }

    return shader
  }

  const createProgram = (vs: WebGLShader, fs: WebGLShader) => {
    const program: any = gl.createProgram()

    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program))
      gl.deleteProgram(program)
      return
    }

    gl.detachShader(program, vs)
    gl.detachShader(program, fs)
    gl.deleteShader(vs)
    gl.deleteShader(fs)

    return program
  }

  const createProgramShader = (vs: string, fs: string) => {
    const vShader = createShader(vs, gl.VERTEX_SHADER)
    const fShader = createShader(fs, gl.FRAGMENT_SHADER)

    return createProgram(vShader, fShader)
  }

  const createVAO = (
    pos: number[],
    inx: number[],
    nor?: number[],
    uv?: number[],
    wei?: number[],
    bon?: number[]
  ) => {
    let vao, vbo, ibo
    vao = gl.createVertexArray()

    gl.bindVertexArray(vao)

    //setup position
    if (pos) {
      vbo = gl.createBuffer()

      gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(ATTR_POSITION_LOC)
      gl.vertexAttribPointer(ATTR_POSITION_LOC, ATTR_POSITION_STR, gl.FLOAT, false, 0, 0)

      vbo = null
    }

    //setup inx
    if (inx) {
      ibo = gl.createBuffer()
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(inx), gl.STATIC_DRAW)
    }

    //setup normal
    if (nor) {
      vbo = gl.createBuffer()

      gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nor), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(ATTR_NORMAL_LOC)
      gl.vertexAttribPointer(ATTR_NORMAL_LOC, ATTR_NORMAL_STR, gl.FLOAT, false, 0, 0)

      vbo = null
    }

    //setup uv
    if (uv) {
      vbo = gl.createBuffer()

      gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(ATTR_UV_LOC)
      gl.vertexAttribPointer(ATTR_UV_LOC, ATTR_UV_STR, gl.FLOAT, false, 0, 0)

      vbo = null
    }

    //setup weights
    if (wei) {
      vbo = gl.createBuffer()

      gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wei), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(ATTR_WEIGHTS_LOC)
      gl.vertexAttribPointer(ATTR_WEIGHTS_LOC, ATTR_WEIGHTS_STR, gl.FLOAT, false, 0, 0)

      vbo = null
    }

    //setup boneIdx
    if (bon) {
      vbo = gl.createBuffer()

      gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bon), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(ATTR_BONEIDX_LOC)
      gl.vertexAttribPointer(ATTR_BONEIDX_LOC, ATTR_BONEIDX_STR, gl.FLOAT, false, 0, 0)

      vbo = null
    }

    gl.bindVertexArray(null)
    return vao
  }

  const getStandardAttLocations = (program: WebGLProgram) => {
    return {
      position: gl.getAttribLocation(program, ATTR_POSITION_NAME),
      normal: gl.getAttribLocation(program, ATTR_NORMAL_NAME),
      uv: gl.getAttribLocation(program, ATTR_UV_NAME),
    }
  }

  const getStandardUniLocations = (program: WebGLProgram) => {
    return {
      mMatrix: gl.getUniformLocation(program, 'mMatrix'),
      vMatrix: gl.getUniformLocation(program, 'vMatrix'),
      pMatrix: gl.getUniformLocation(program, 'pMatrix'),
    }
  }

  const loadTexture = async (src: string) => {
    const img = new Image()

    img.src = src
    await img.decode()

    let tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST)
    gl.generateMipmap(gl.TEXTURE_2D)

    gl.bindTexture(gl.TEXTURE_2D, null)

    return tex
  }

  return {
    createProgramShader,
    createVAO,
    getStandardAttLocations,
    getStandardUniLocations,
    loadTexture,
  }
}

export default glUtils
