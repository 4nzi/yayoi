export interface SETTING {
  albedo: number[] | string
  rimColor?: number[]
  sdwThreshold?: number
  hiThreshold?: number
  rimThreshold?: number
  mainLight?: number[]
  edgeWidth?: number
  skinning: boolean
}

export interface ATTRIBUTE {
  pos: number[]
  nor: number[]
  uv: number[]
  inx: number[]
  tan: number[]
  wei: number[]
  bon: number[]
}

export interface SKIN {
  jointNum: 0
  name: string
  nodeIdx: number
  parent: number | null
  position: number[] | null
  rotation: number[] | null
  scale: number[] | null
}

export interface JOINT {
  name: string
  jointNum: number
  parent: number | null
  isModified: boolean
  position: number[]
  rotation: number[]
  localMat: number[]
  worldMat: number[]
  bindMat: number[]
  offsetMat: number[]
}

export interface TEXTURE {
  albedo: string
  normal: string
}

export interface SCENE {
  translation: number[]
  rotation: number[]
  scale: number[]
}

export interface ANIMATIONS {
  [index: string]: {
    rotation: {
      interp: string
      samples: Array<{
        t: number
        v: number[]
      }>
    }
  }
}

export interface MESH {
  id: number
  attribute: ATTRIBUTE
  skins: SKIN[]
  texture: TEXTURE
  scene: SCENE
  animations: ANIMATIONS
}

export interface JSON {
  accessors: Array<{
    bufferView: number
    componentType: number
    count: number
    max?: number[]
    min?: number[]
    type: string
  }>
  animations?: Array<{
    channels: Array<{
      sampler: number
      target: {
        node: number
        path: string
      }
    }>
    name: string
    samplers: Array<{
      input: number
      interpolation: string
      output: number
    }>
  }>
  asset: {
    generator: string
    version: string
  }
  bufferViews?: Array<{
    buffer: number
    byteLength: number
    byteOffset: number
  }>
  buffers?: Array<{
    byteLength: number
  }>
  images?: Array<{
    bufferView: number
    mimeType: string
    name: string
  }>
  materials?: Array<{
    doubleSided: boolean
    name: string
    pbrMetallicRoughness?: {
      baseColorTexture?: {
        index: number
      }
      metallicFactor?: number
      roughnessFactor?: number
    }
  }>
  meshes: Array<{
    name: string
    primitives: Array<{
      attributes: {
        JOINTS_0?: number
        NORMAL?: number
        POSITION: number
        TEXCOORD_0?: number
        WEIGHTS_0?: number
        TANGENT?: number
      }
      indices: number
      material?: number
    }>
  }>
  nodes?: Array<{
    children?: number[]
    name?: string
    rotation?: number[]
    scale?: number[]
    translation?: number[]
  }>
  samplers?: Array<{
    magFilter: number
    minFilter: number
  }>
  scene: number
  scenes: Array<{
    name: string
    nodes: number[]
  }>
  skins?: Array<{
    inverseBindMatrices: number
    joints: number[]
    name: string
  }>
  textures?: Array<{
    sampler: number
    source: number
  }>
}

export interface JSONDATA {
  json: JSON
  length: number
}
