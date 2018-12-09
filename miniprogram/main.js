import Director from './js/Director.js';
import DataStore from './js/base/DataStore.js';
import DataBus from './js/databus.js'
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const ratio = wx.getSystemInfoSync().pixelRatio;
let databus = new DataBus()
export default class Main {
  constructor() {
    
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    // 解决图片模糊问题
    canvas.width = screenWidth * ratio;
    canvas.height = screenHeight * ratio;
    this.ctx.scale(ratio, ratio);

    let openDataContext = wx.getOpenDataContext();
    let sharedCanvas = openDataContext.canvas;
    sharedCanvas.width = screenWidth * ratio;
    sharedCanvas.height = screenHeight * ratio;
    DataStore.getInstance().sharedCanvas = sharedCanvas;

    this.dataStore = DataStore.getInstance();
    this.director = Director.getInstance(this.ctx);
    this.dataStore.canvas = this.canvas;
    this.dataStore.ctx = this.ctx;
    this.dataStore.director = this.director;
    this.init();
  }
  
  init() {
    this.director.run(this.ctx);
  }
}