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
    wx.cloud.init()
    this.db = wx.cloud.database()
    this.pool = new Pool()
    this.wjj = 'ball01'
    this.myAppReward = 0
    this.openid = ""
    this.personalHighScore = null
    this.login()
    this.reset()
    this.maxscore = this.personalHighScore || wx.getStorageSync('maxScore') || 0
  }

  reset() {
    this.colorNum = 3
    this.vol = wx.getStorageSync('volSet') || "1"
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
    this.caisetips = 0
  }
  login() {
    // 获取 openid
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        this.openid = res.result.openid
        this.prefetchHighScore()
      },
      fail: err => {
        console.error('get openid failed with error', err)
      }
    })
  }
  prefetchHighScore() {
    // 预取历史最高分
    this.db.collection('user_score').doc(`${this.openid}-score`).get()
      .then(res => {
        if (this.personalHighScore) {
          if (res.data.max > this.personalHighScore) {
            this.personalHighScore = res.data.max
          }
        } else {
          this.personalHighScore = res.data.max
        }
        this.maxscore = wx.getStorageSync('maxScore') > this.personalHighScore ? wx.getStorageSync('maxScore') : this.personalHighScore
      })
      .catch(err => {
        console.error('db get score catch error', err)
        this.prefetchHighScoreFailed = true
      })
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
