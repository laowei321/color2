import PlayScene from './playScene';
import DataStore from '../base/DataStore';
import Sprite from '../base/sprite';
import DataBus from '../databus.js'
// import {getAuthSettings, createUserInfoButton} from '../utils/auth.js';
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const ratio = wx.getSystemInfoSync().pixelRatio;
let databus = new DataBus()
export default class HomeScene {
  constructor(ctx) {
    
    this.ctx = ctx;
    this.canvas = DataStore.getInstance().canvas;
    this.loop();
  }
  drawHomeEle() {
    this.homeEle = "images/bg3.png";
    this.homeImg = new Sprite(this.homeEle, screenWidth, screenHeight);
    this.homeImg.drawToCanvas(this.ctx);
  }
  drawButton() {
    this.btnImg = "images/btn12.png";
    this.btnImgInfo = [200,244];
    this.startSprite = new Sprite(this.btnImg, this.btnImgInfo[0], this.btnImgInfo[1], screenWidth / 2 - this.btnImgInfo[0] / 2, screenHeight / 2 - this.btnImgInfo[1] / 2);
    this.startSprite.drawToCanvas(this.ctx);

    this.rankImg = "images/rank.png";
    this.rankImgInfo = [80,80];
    this.rankSprite = new Sprite(this.rankImg, this.rankImgInfo[0], this.rankImgInfo[1], screenWidth *3/ 8 - this.rankImgInfo[0] / 2, screenHeight / 2 + this.btnImgInfo[1] / 2+20);
    this.rankSprite.drawToCanvas(this.ctx);

    this.audioOnImg = "images/audio_on.png";
    this.audioOnImgInfo = [80, 80];
    this.audioOnSprite = new Sprite(this.audioOnImg, this.audioOnImgInfo[0], this.audioOnImgInfo[1], screenWidth * 5 / 8 - this.audioOnImgInfo[0] / 2, screenHeight / 2 + this.btnImgInfo[1] / 2 + 20);
    this.audioOffImg = "images/audio_off.png";
    this.audioOffImgInfo = [80, 80];
    this.audioOffSprite = new Sprite(this.audioOffImg, this.audioOffImgInfo[0], this.audioOffImgInfo[1], screenWidth * 5 / 8 - this.audioOffImgInfo[0] / 2, screenHeight / 2 + this.btnImgInfo[1] / 2 + 20);
    if (databus.vol === "0") { this.audioOffSprite.drawToCanvas(this.ctx); } else {
      this.audioOnSprite.drawToCanvas(this.ctx);
    }

    this.bindEvent();
  }
  loop() {
    // console.log(this.requestId)
    this.ctx.clearRect(0, 0, screenWidth, screenHeight);
    this.drawHomeEle();
    this.drawButton();
    // console.log(DataStore.getInstance().userInfo);
    // if (!DataStore.getInstance().userInfo) {
    //     createUserInfoButton();
    // }
    if (DataStore.getInstance().shareTicket && !this.showGroup) {
      this.showGroup = true;
      this.messageSharecanvas(3, DataStore.getInstance().shareTicket);
      // wx.showLoading({
      //   title: '加载中，骚等下下',
      // })

      // setTimeout(function () {
      //   wx.hideLoading()
      // }, 1500)
      DataStore.getInstance().shareTicket = ""
    }
    if (this.ranking) {
      // 子域canvas 放大绘制，这里必须限制子域画到上屏的宽高是screenWidth， screenHeight
      DataStore.getInstance().ctx.drawImage(DataStore.getInstance().sharedCanvas, 0, 0, screenWidth, screenHeight);
    }
    this.requestId = requestAnimationFrame(this.loop.bind(this));
  }
  messageSharecanvas(mestype, ticket) {
    // 排行榜也应该是实时的，所以需要sharedCanvas 绘制新的排行榜
    let openDataContext = wx.getOpenDataContext();
    openDataContext.postMessage({
      messageType: mestype || 1,
      text: ticket
    });
    this.ranking = true;
  }
  bindEvent() {
    let _this = this;
    wx.offTouchStart();
    if (_this.ranking) {
      wx.onTouchStart((e) => {
        let x = e.touches[0].clientX,
          y = e.touches[0].clientY;
        let scale = screenWidth / 750;
        if (x >= 80 * scale && x <= 180 * scale && y >= 1120 * scale && y <= 12200 * scale) {// 返回按钮
          _this.ranking = false;
          setTimeout(() => {
            cancelAnimationFrame(_this.requestId);
          }, 20);
        }
      });
      return;
    }
    wx.onTouchStart((e) => {
      let x = e.touches[0].clientX,
        y = e.touches[0].clientY;
      if (x >= _this.startSprite.x
        && x <= _this.startSprite.x + _this.startSprite.width
        && y >= _this.startSprite.y
        && y <= _this.startSprite.y + _this.startSprite.height) {
        cancelAnimationFrame(_this.requestId);
        DataStore.getInstance().director.toPlayScene(_this.ctx);
      } else if (x >= _this.rankSprite.x
        && x <= _this.rankSprite.x + _this.rankSprite.width
        && y >= _this.rankSprite.y
        && y <= _this.rankSprite.y + _this.rankSprite.height) {
        // 排行榜也应该是实时的，所以需要sharedCanvas 绘制新的排行榜
        _this.messageSharecanvas();
        _this.loop();
        wx.offTouchStart(); // 在分享canvas还是会响应事件，所以先解除事件绑定
      } else if (x >= _this.audioOnSprite.x
        && x <= _this.audioOnSprite.x + _this.audioOnSprite.width
        && y >= _this.audioOnSprite.y
        && y <= _this.audioOnSprite.y + _this.audioOnSprite.height
      ){
        if(databus.vol==="0"){databus.vol = "1"}
        else {databus.vol = "0"}
        console.log("Vol = "+databus.vol)
        wx.setStorageSync('volSet', databus.vol)
        _this.ctx.clearRect(0, 0, screenWidth, screenHeight);
        _this.drawHomeEle();
        _this.drawButton();
      }
    });
  }
}