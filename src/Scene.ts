import Model from './Model'

export default class Scene {
  models: Model[]
  lightPosition: number[]
  environment: number[]

  constructor() {
    this.models = []
    this.lightPosition = [-0.5, -0.5, -0.1]
    this.environment = [0.3, 0.3, 0.3, 1.0]
  }

  push(model: Model) {
    this.models.push(model)
  }

  setLightPosition(pos: number[]) {
    this.lightPosition = pos
  }

  setEnvironment(vec: number[]) {
    this.environment = vec
    return this
  }

  // preRender
  preRender() {
    return this
  }
}
