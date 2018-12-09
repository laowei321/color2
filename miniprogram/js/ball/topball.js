import Sprite from '../base/sprite.js'
import DataBus from '../databus'

let databus = new DataBus()
const wjj = databus.wjj;
const BALL_IMG_ARRAY = ['', 'images/' + wjj + '/1.png', 'images/' + wjj + '/2.png', 'images/' + wjj + '/3.png', 'images/' + wjj + '/4.png', 'images/' + wjj + '/5.png', 'images/' + wjj + '/6.png', 'images/' + wjj + '/7.png', 'images/' + wjj + '/8.png'];

const screenWidth = window.innerWidth;
const itemwidth = screenWidth / 9;
const __ = {
  num: Symbol('num')
}

let BALL_WIDTH = itemwidth * 0.9

export default class Topball extends Sprite {
  constructor(imgSrc, width, height) {
    super(imgSrc, BALL_WIDTH, BALL_WIDTH);
  }

  init(a, num) {
    this.x = (1.02 * a + 1.95) * itemwidth
    this.y = 2.98 * itemwidth
    this[__.num] = num
    switch (this[__.num]) {
      case 1: this.img.src = BALL_IMG_ARRAY[1]; break;
      case 2: this.img.src = BALL_IMG_ARRAY[2]; break;
      case 3: this.img.src = BALL_IMG_ARRAY[3]; break;
      case 4: this.img.src = BALL_IMG_ARRAY[4]; break;
      case 5: this.img.src = BALL_IMG_ARRAY[5]; break;
      case 6: this.img.src = BALL_IMG_ARRAY[6]; break;
      case 7: this.img.src = BALL_IMG_ARRAY[7]; break;
      case 8: this.img.src = BALL_IMG_ARRAY[8]; break;
    }
    this.visible = true
  }
  update(){
    // if (this.visible == false) {
    //   databus.removeTopball(this)
    // }
  }
}