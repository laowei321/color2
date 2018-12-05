import Director from './js/Director';
import DataStore from './js/base/DataStore';
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const ratio = wx.getSystemInfoSync().pixelRatio;

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
    this.setShare();
  }
  setShare() {
    wx.showShareMenu({
      withShareTicket: true,
    });
    wx.onShareAppMessage(function () {
      // 用户点击了“转发”按钮
      switch(Math.floor(Math.random()*6+1)){
        case 1:
          return {
            title: '你的小可爱向你丢了一个小彩球并捎来一句话，快进来看看吧~',
            imageUrl: 'images/share1.png',
            query: 'openId=1&sharepic=share1'
          }
          break; 
        case 2:
          return {
            title: '@你 来帮我看看这个题吧。。数学好像还给老师了。。',
            imageUrl: 'images/share2.jpg',
            query: 'openId=1&sharepic=share2'
          }
          break;
        case 3:
          return {
            title: '我一直在寻找一个真正的对手，会是你吗？',
            imageUrl: 'images/share3.jpg',
            query: 'openId=1&sharepic=share3'
          }
          break;
        case 4:
          return {
            title: '@所有人~',
            imageUrl: 'images/share4.jpg',
            query: 'openId=1&sharepic=share4'
          }
          break;
        case 5:
          return {
            title: '原来找对象真的这么简单，800分随机，1500分竟然能随便选！',
            imageUrl: 'images/qinglv.jpg',
            query: 'openId=1&sharepic=share5'
          }
          break; 
        case 6:
          return {
            title: '这个消除游戏玩到1000多分居然爆屠龙！！我只想说一个字：牛B！',
            imageUrl: 'images/share6.jpg',
            query: 'openId=1&sharepic=share6'
          }
          break; 
      }
    })
  }
}