export default class RenderLoop {
  msLastFrame: any
  callBack: any
  isActive: boolean
  fps: number
  msFpsLimit: number
  run: any

  constructor(callback: any, fps = 30) {
    let oThis = this
    this.msLastFrame = null
    this.callBack = callback
    this.isActive = false
    this.fps = 0
    this.msFpsLimit = 1000 / fps

    this.run = () => {
      let msCurrent = performance.now(),
        msDelta = msCurrent - oThis.msLastFrame,
        deltaTime = msDelta / 1000.0

      if (msDelta >= oThis.msFpsLimit) {
        oThis.fps = Math.floor(1 / deltaTime)
        oThis.msLastFrame = msCurrent
        oThis.callBack(deltaTime)
      }

      if (oThis.isActive) requestAnimationFrame(oThis.run)
    }
  }

  start() {
    this.isActive = true
    this.msLastFrame = performance.now()
    requestAnimationFrame(this.run)
    return this
  }

  stop() {
    this.isActive = false
  }
}
