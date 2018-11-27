import Databus from '../databus.js'
const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

let atlas = new Image()
let databus = new Databus()
atlas.src = 'images/Common.png'
let zhezhao = new Image()
zhezhao.src = 'images/bg2.png'
let encourage = new Image()
encourage.src = 'images/encourage.png'
let replay2 = new Image()
replay2.src = 'images/btn2.png'
let home_btn = new Image()
home_btn.src = 'images/home.png'
export default class GameInfo {
  renderGameScore(ctx, score) {
    ctx.drawImage(home_btn, 0, 0, home_btn.width, home_btn.height, 0, screenWidth * 1 / 9, screenWidth/9, screenWidth/9)
    ctx.fillStyle = "black"
    ctx.font = " 26px Arial"
    ctx.fillText(
      databus.maxscore,
      screenWidth * 0.42,
      screenWidth * 0.266
    )
    ctx.font = " 32px Arial "
    ctx.fillText(
      databus.score,
      screenWidth * 0.78,
      screenWidth * 0.35
    )
  }
  renderGameTips(ctx){
    ctx.fillStyle = "#ffffff"
    ctx.font = "14px Arial"
    ctx.fillText(
      'Tips：点击小球将其选中，点击空格移动小球。',
      15,
      screenWidth * 13 / 9 + 30
    )
    ctx.fillText(
      '相同颜色5连以上即可消除,多消加分更多。',
      45,
      screenWidth * 13 / 9 + 54
    )
    ctx.fillText(
      '未消除时会随机置入上方的3个预备小球。',
      45,
      screenWidth * 13 / 9 + 78
    )
  }
  renderGameOver(ctx, score) {
    ctx.drawImage(zhezhao, 0, 0, zhezhao.width, zhezhao.height, 0, screenWidth * 4 / 9, screenWidth, screenWidth)
    ctx.fillStyle = "#ffffff"
    ctx.font    = "28px Arial"

    ctx.fillText(
      'Score: ' + score,
      screenWidth / 2 - 70,
      screenWidth * 2 / 3 + 60
    )
    ctx.drawImage(encourage, 0, 0, encourage.width, encourage.height, screenWidth / 2 - encourage.width / 2, screenWidth * 5 / 9, encourage.width, encourage.height)

    ctx.drawImage(replay2, 0, 0, replay2.width, replay2.height, screenWidth / 2 - 90, screenWidth*8/9+20, 180, 180)

    /**
     * 重新开始按钮区域
     * 方便简易判断按钮点击
     */
    this.btnArea = {
      startX: screenWidth / 2 - 90,
      startY: screenWidth*8/9 + 20,
      endX  : screenWidth / 2  + 90,
      endY: screenWidth*8/9 + 200
    }
  }
}

