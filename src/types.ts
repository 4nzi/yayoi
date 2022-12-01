export interface ATTRIBUTE {
  pos: number[]
  inx: number[]
}

export interface MESH {
  id: number
  attribute: ATTRIBUTE
}

// export interface MESH {
//     id: number
//     attribute: {
//       inx: Array<number>
//       nor: Array<number>
//       tan: Array<number>
//       pos: Array<number>
//       uv: Array<number>
//       bon: Array<number>
//       wei: Array<number>
//     }
//     texture: {
//       albedo: string
//       normal: string
//     }
//     skins: {
//       id: Number
//       jointInx: Number
//       name: String
//       position: Array<number>
//       scale: Array<number>
//       rotation: Array<number>
//       children: Array<number>
//     }
//     scene: {
//       translation: Array<number>
//       rotation: Array<number>
//       scale: Array<number>
//     }
//   }

export interface POST {
  id: string
  title: string
  description: string
  thum: string
  images?: Array<{
    id: string
    file: string
    caption?: string
    post: string
  }>
  created_at: string
  liked: Array<string>
  userPost: string
}
