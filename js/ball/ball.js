import Sprite from '../base/sprite.js'
import DataBus from '../databus.js'
import Bg from '../runtime/background.js'

let databus = new DataBus()

const wjj = databus.wjj;
const BALL_IMG_ARRAY = ['', 'images/' + wjj + '/1.png', 'images/' + wjj + '/2.png', 'images/' + wjj + '/3.png', 'images/' + wjj + '/4.png', 'images/' + wjj + '/5.png', 'images/' + wjj + '/6.png', 'images/' + wjj + '/7.png', 'images/' + wjj + '/8.png'];

const kzarray = [1,1,1,1,1,1,1,1,1,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
const screenWidth = window.innerWidth;
const itemwidth = screenWidth / 9;
const BALL_WIDTH = itemwidth * 0.9;


export default class Ball extends Sprite {
  constructor(imgSrc, width, height) {
    super(imgSrc, BALL_WIDTH, BALL_WIDTH);
    this.padd = (156 / 108 - 1) * screenWidth;
  }

  init(i,j,num) {
    this.x = (j + 1 / 20) * itemwidth;
    this.y = this.padd + (i + 1 / 20) * itemwidth;
    this.i = i//行
    this.j = j//列
    // this.ii = i
    // this.jj = j
    this.num = num
    switch(num){
      case 1: this.img.src = BALL_IMG_ARRAY[1]; break;
      case 2: this.img.src = BALL_IMG_ARRAY[2]; break;
      case 3: this.img.src = BALL_IMG_ARRAY[3]; break;
      case 4: this.img.src = BALL_IMG_ARRAY[4]; break;
      case 5: this.img.src = BALL_IMG_ARRAY[5]; break;
      case 6: this.img.src = BALL_IMG_ARRAY[6]; break;
      case 7: this.img.src = BALL_IMG_ARRAY[7]; break;
      case 8: this.img.src = BALL_IMG_ARRAY[8]; break;
    }
    this.ayy = this.padd + (i + 1 / 20) * itemwidth;
    this.visible = true
  }
  // 每一帧更新小球高与位移
  update() {
    if (this.j == databus.last_xy[1] && this.i == databus.last_xy[0]){
      let spe = 0.03, aa = databus.frame % 20
      this.y += spe * kzarray[aa] * itemwidth
      this.height -= spe * kzarray[aa] * itemwidth
    }else{
        this.height = BALL_WIDTH
        this.y = this.ayy
    }
  }
  recycle(){
    databus.removeBall(this)
  }
}