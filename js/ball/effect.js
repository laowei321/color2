import Animation from '../base/animation'
import DataBus from '../databus'
const screenWidth = window.innerWidth;

let databus = new DataBus()
let effect_pic = 'images/explosion/explosion1.png'
let effect_width = screenWidth / 9

export default class Effect extends Animation {
  constructor() {
    super(effect_pic, effect_width, effect_width)
    /**
     * 推入到全局动画池里面
     * 便于全局绘图的时候遍历和绘制当前动画帧
     */
    this.initExplosionAnimation()
    databus.effects.push(this)
  }

  init(x,y) {
    this.x = x - screenWidth / 20
    this.y = y - screenWidth / 20
    this.visible = true
  }

  // 预定义爆炸的帧动画
  initExplosionAnimation() {
    let frames = []

    const EXPLO_IMG_PREFIX = 'images/explosion/explosion'
    const EXPLO_FRAME_COUNT = 19

    for (let i = 0; i < EXPLO_FRAME_COUNT; i++) {
      frames.push(EXPLO_IMG_PREFIX + (i + 1) + '.png')
    }

    this.initFrames(frames)
  }

  update() {

  }
}
