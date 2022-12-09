import { matIV, qtnIV } from './utils/minMatrix'
import { SKIN, JOINT, ANIMATIONS } from './types'

const m = new matIV()
const q = new qtnIV()

export default class Armature {
  joints: JOINT[]
  orderedJoints: JOINT[]
  animations: ANIMATIONS | null
  isActive: boolean
  isLoop: boolean
  frame: { start: number; end: number; current: number }

  constructor() {
    this.joints = []
    this.orderedJoints = []
    this.animations = null
    this.isActive = false
    this.isLoop = false
    this.frame = { start: 0, end: 0, current: 0 }
  }

  loadGLTFSkins(skins: SKIN[]) {
    if (skins == null || undefined) return console.warn('skin is not defind')

    skins.forEach((skin) =>
      this.addJoint(skin.name, skin.rotation, skin.position, skin.parent, skin.jointNum)
    )

    this.setBindPose()
    this.update()
    return this
  }

  addJoint(
    name: string,
    rot: number[] | null,
    pos: number[] | null,
    parentInx: number | null,
    jointNum: number
  ) {
    this.joints.push({
      name: name,
      jointNum: jointNum,
      parent: parentInx,
      isModified: false,

      position: pos || [0, 0, 0],
      rotation: rot || [0, 0, 0, 1],

      localMat: m.identity(m.create()), // local = parent space coord
      worldMat: m.identity(m.create()), // world = parent.world * local
      bindMat: m.identity(m.create()), // inverse(world)
      offsetMat: m.identity(m.create()), // offset = parent.world * (local * diff) * bind
    })
  }

  setBindPose() {
    let c, p

    for (let i in this.joints) {
      c = this.joints[i] // Current Bone
      p = c.parent != null ? this.joints[c.parent] : null // Parent Bone

      //Calc Local matrix
      let tempMat = m.identity(m.create())

      m.translate(c.localMat, c.position, c.localMat)
      q.toMatIV(c.rotation, tempMat)
      m.inverse(tempMat, tempMat)
      m.multiply(c.localMat, tempMat, c.localMat)

      c.isModified = false

      //Calc World matrix
      if (p != null) m.multiply(p.worldMat, c.localMat, c.worldMat)
      else c.worldMat = c.localMat

      m.inverse(c.worldMat, c.bindMat)
    }
  }

  setPose(name: string, qtn: number[]) {
    const target = this.joints.find((joint) => joint.name == name)
    let invQtn = q.identity(q.create())

    if (!target) {
      console.log(`${name} is not found`)
      return
    }

    q.inverse(qtn, invQtn)

    target.rotation = invQtn
    target.isModified = true
    return this
  }

  setAnimations(anims: ANIMATIONS) {
    this.animations = anims
    return this
  }

  update() {
    let c, p
    let forceUpdate = false

    for (let i in this.joints) {
      c = this.joints[i] // Current Bone
      p = c.parent != null ? this.joints[c.parent] : null // Parent Bone

      if (c.isModified) {
        forceUpdate = true
        let tempMat = m.identity(m.create())

        m.identity(c.localMat)
        m.translate(c.localMat, c.position, c.localMat)
        q.toMatIV(c.rotation, tempMat)
        m.multiply(c.localMat, tempMat, c.localMat)

        c.isModified = false
      }

      if (forceUpdate) {
        if (p != null) m.multiply(p.worldMat, c.localMat, c.worldMat)
        else c.worldMat = c.localMat

        m.multiply(c.worldMat, c.bindMat, c.offsetMat)
      }
    }

    this.getFlatJointNum()
  }

  getFlatJointNum() {
    for (let i in this.joints) {
      this.orderedJoints[this.joints[i].jointNum] = this.joints[i]
    }
  }

  playAnimation() {
    if (this.animations == null || undefined) return console.log(' No animation set')
    if (this.frame.current == this.frame.end && !this.isLoop) return

    if (this.isActive) {
      if (this.frame.current == this.frame.end) this.frame.current = this.frame.start

      for (let i in this.animations) {
        this.setPose(i, this.animations[i].rotation.samples[this.frame.current].v)
      }

      this.frame.current++
    }

    this.update()
  }

  play(start: number, end: number, isLoop: boolean) {
    this.isActive = true
    this.isLoop = isLoop
    this.frame = { start: start, end: end, current: start }
    return this
  }

  stop() {
    this.isActive = false
    this.isLoop = false
    this.frame = { start: 0, end: 0, current: 0 }
    return this
  }
}
