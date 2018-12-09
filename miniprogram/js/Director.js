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
    this.setShare();
  }
  setShare() {
    wx.showShareMenu({
      withShareTicket: true,
    });
    wx.onShareAppMessage(function () {
      // 用户点击了“转发”按钮
      switch (Math.floor(Math.random() * 6 + 1)) {
        case 1:
          return {
            title: '你的小可爱向你丢了一个小彩球并捎来一句话，快进来看看吧~',
            imageUrl: 'images/share1.png',
            query: 'openID='+databus.openid+'&sharepic=share1'
          }
          break;
        case 2:
          return {
            title: '@你 这是什么鬼题，结果大吃一斤。。',
            imageUrl: 'images/share2.jpg',
            query: 'openID=' + databus.openid + '&sharepic=share2'
          }
          break;
        case 3:
          return {
            title: '我一直在寻找一个真正的对手，会是你吗？',
            imageUrl: 'images/share3.jpg',
            query: 'openID=' + databus.openid + '&sharepic=share3'
          }
          break;
        case 4:
          return {
            title: '@所有人 👇👇👇',
            imageUrl: 'images/share4.jpg',
            query: 'openID=' + databus.openid + '&sharepic=share4'
          }
          break;
        case 5:
          return {
            title: '在这找对象真简单!800分随机，1500分竟然能随便选！',
            imageUrl: 'images/qinglv.jpg',
            query: 'openID=' + databus.openid + '&sharepic=share5'
          }
          break;
        case 6:
          return {
            title: '这个消除游戏过1000分居然爆屠龙！！我只想说一个字：牛B！',
            imageUrl: 'images/share6.jpg',
            query: 'openID=' + databus.openid + '&sharepic=share6'
          }
          break;
      }
    })
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
