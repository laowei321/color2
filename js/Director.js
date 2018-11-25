// 控制游戏逻辑
import HomeScene from './scene/homeScene';
import PlayScene from './scene/playScene';
import DataStore from './base/DataStore';
import DataBus from 'databus.js';
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const ratio = wx.getSystemInfoSync().pixelRatio;
let databus = new DataBus()
export default class Director {
  constructor(ctx) {
    let launchOptions = wx.getLaunchOptionsSync()
    console.log(launchOptions)
    if (launchOptions.scene === 1044) {
      DataStore.getInstance().shareTicket = launchOptions.shareTicket
    };
    wx.onShow((res) => {
      if (res.scene === 1104 && databus.myAppReward === 0) {
        databus.score += 100
        if (databus.score > databus.maxscore) {
          databus.maxscore = databus.score
          wx.setStorageSync('maxScore', databus.maxscore);
        }
        databus.myAppReward = 1
      }
    })
    this.ctx = ctx; // 主屏的ctx
  }
  static getInstance() {
    if (!Director.instance) {
      Director.instance = new Director();
    }
    return Director.instance;
  }

  run(ctx) {
    this.showHomeScene(ctx);
  }
  // 首页场景
  showHomeScene(ctx) {
    ctx.clearRect(0, 0, screenWidth * ratio, screenHeight * ratio);
    this.homeScene = new HomeScene(ctx);
  }

  toPlayScene() {
    let ctx = DataStore.getInstance().ctx;
    ctx.clearRect(0, 0, screenWidth * ratio, screenHeight * ratio);
    new PlayScene(ctx);
    DataStore.getInstance().currentCanvas = 'PlayCanvas';
  }
  // 结果场景
  // showResultScene() {
  //   let ctx = DataStore.getInstance().ctx;
  //   ctx.clearRect(0, 0, screenWidth * ratio, screenHeight * ratio);
    // this.resultCanvas = wx.createCanvas();
    // let resultCtx = this.resultCanvas.getContext('2d');
    // this.resultCanvas.width = screenWidth * ratio;
    // this.resultCanvas.height = screenHeight * ratio;
    // let scales = screenWidth / 750;
    // resultCtx.scale(ratio, ratio);

    // resultCtx.scale(scales, scales);

    // DataStore.getInstance().resultCanvas = this.resultCanvas;
    // new ResultScene(ctx);

    // new ResultScene(DataStore.getInstance().ctx);
    // DataStore.getInstance().currentCanvas = 'resultCanvas';
  // }
}
