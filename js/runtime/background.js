import Sprite from '../base/sprite'

const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

const BG_IMG_SRC   = 'images/xiaoxiao4.png'
const BG_WIDTH     = 1080
const BG_HEIGHT    = 1560

/**
 * 游戏背景类
 */
export default class BackGround extends Sprite {
  constructor(ctx) {
    super(BG_IMG_SRC, BG_WIDTH, BG_HEIGHT)

    this.ratio = BG_HEIGHT / BG_WIDTH
    this.render(ctx)
  }


  /**
   * 背景图重绘函数
   * 绘制两张图片，两张图片大小和屏幕一致
   * 第一张漏出高度为top部分，其余的隐藏在屏幕上面
   * 第二张补全除了top高度之外的部分，其余的隐藏在屏幕下面
   */
  render(ctx) {
    ctx.drawImage(
      this.img,
      0,
      0,
      screenWidth,
      this.ratio * screenWidth
    )
  }
}
