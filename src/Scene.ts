import Model from './Model'

export default class Scene {
  models: Model[]
  lightPosition: number[]

  constructor() {
    this.models = []
    this.lightPosition = [-0.5, -0.5, -0.1]
  }

  push(model: Model) {
    this.models.push(model)
  }

  setLightPosition(pos: number[]) {
    this.lightPosition = pos
  }

  // preRender
  preRender() {
    return this
  }
}
