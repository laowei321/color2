import Pool from './base/pool'

let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if ( instance )
      return instance

    instance = this

    this.pool = new Pool()
    this.wjj = 'ball01'
    this.colorNum = 7
    this.myAppReward = 0
    this.reset()
  }

  reset() {
    this.vol = wx.getStorageSync('volSet') || "1"
    this.maxscore = wx.getStorageSync('maxScore') || 0
    this.frame      = 0
    this.score      = 0
    this.balls = []
    this.topballs = []
    this.effects = []
    this.framemark = 0
    this.nextnum = ['','','']
    this.ani_pos = [-1, -1]
    this.last_xy = [-1, -1]
    this.focus = false
    this.focuscolor = 0
    this.gameOver   = false
    this.aniid = []
    this.aniId = 0 
    this.score_plus = 0
  }

  /**
   * 回收小球，进入对象池
   * 此后不进入帧循环
   */
  removeBall(ball) {
    let temp = this.balls.shift()

    temp.visible = false

    this.pool.recover('ball', ball)
  }
  removeTopball(topball) {
    let temp = this.topballs.shift()

    temp.visible = false

    this.pool.recover('topball', topball)
  }
  removeEffect(effect) {
    let temp = this.effects.shift()

    temp.visible = false

    this.pool.recover('effect', effect)
  }
}
