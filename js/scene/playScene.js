import BackGround from '../runtime/background.js'
import GameInfo from '../runtime/gameinfo.js'
import Music from '../runtime/music.js'
import DataBus from '../databus.js'
import Effect from '../ball/effect.js'
import Ball from '../ball/ball.js'
import Topball from '../ball/topball.js'
import DataStore from '../base/DataStore.js';
import Sprite from '../base/sprite';

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const ratio = wx.getSystemInfoSync().pixelRatio;
const itemwidth = screenWidth / 9;
const rows = 9,
  cols = 9;

//初始小球数量
const initBallNum = 30;
const ballSpeed = 40;
let databus = new DataBus();

/**
 * 游戏主函数
 */
export default class PlayScene {
  constructor(ctx) {
    // 维护当前requestAnimationFrame的id
    this.databus = databus
    this.aniId = 0;
    this.ctx = ctx;
    this.padding = screenHeight - screenWidth;
    this.restart()
    
  }
  static getInstance() {
    if (!PlayScene.instance) {
      PlayScene.instance = new PlayScene();
    }
    return PlayScene.instance;
  }

  replay() {
    databus.reset();
    if(databus.myAppReward === 1 && databus.score === 0){
      databus.score = 100;
    }
    this.restart();
  }
  initEvent() {
    let that = this;
    wx.offTouchStart();
    wx.onTouchStart((e) => {
      let x = e.touches[0].clientX;
      let y = e.touches[0].clientY;
      if(x>=0 && x<=screenWidth/9 &&y>=screenWidth/9 && y<=screenWidth*2/9){
        wx.offTouchStart();
        cancelAnimationFrame(that.aniId);
        databus.reset();
        if (databus.myAppReward === 1 && databus.score === 0) {
          databus.score = 100;
        }
        DataStore.getInstance().director.showHomeScene(that.ctx);
      }
      else if (y >= that.padding && y <= that.padding + screenWidth) {
        let j = Math.floor(x / itemwidth);
        let i = Math.floor((y - that.padding) / itemwidth);
        if(that.array[i][j] !== 0){
          that.music.playFocus();
          if(i === that.databus.last_xy[0] && j === that.databus.last_xy[1]){
            console.log("the same ball")
          }else{
            console.log('This pos', i, j);
            that.databus.last_xy = [i, j];
            that.databus.focus = true;
            that.databus.focuscolor = that.array[i][j];
            that.databus.frame = 0;
          }
        }
        else{
          if (that.databus.focus === false) {console.log('empty', i, j)}
          else{
          //检测路径
          let per_i = that.databus.last_xy[0];
          let per_j = that.databus.last_xy[1];
          console.log(per_i, per_j, 'move to', i, j);
          let resultArr = that.finder([per_i, per_j], [i, j]);
          let rl = resultArr.length;
          if (rl === 0) {
            this.music.playShoot();
            wx.showToast({
              title: 'no way..',
              duration: 300,
              icon: "none"
            });
          } else {
            // console.log(resultArr[rl - 1])
            for (let q = 0; q < rl; q++) {
              let mmp = q;
              setTimeout(() => {
                let m = resultArr[mmp][0],
                  n = resultArr[mmp][1];
                that.databus.balls.forEach((item) => {
                  if (item.i === per_i && item.j === per_j) {
                    // console.log(item)
                    item.x = (n + 1 / 20) * itemwidth;
                    item.y = that.padding + (m + 1 / 20) * itemwidth;
                    item.height = itemwidth * 0.9;
                    if (mmp === rl - 1) {
                      item.visible = false;
                      item.recycle()
                    }
                    item.drawToCanvas(that.ctx)
                  }
                })
              }, ballSpeed * q)
            }

            setTimeout(() => {
              that.array[per_i][per_j] = 0;
              that.databus.focus = false;
              that.array[i][j] = that.databus.focuscolor;
              that.databus.last_xy = [-1,-1];
              //检测消除
              let check_eli = that.check_eliminate(that.databus.focuscolor, i, j);
              if (check_eli != null) {
                that.reg_eliminate(check_eli);
                that.reg_score(check_eli);
              } else {
                that.put3ball();
                that.next3ball();
                that.show3balls();
              }
              that.databus.balls = [];
              that.drawballs();
            }, rl * ballSpeed - ballSpeed)
          }
          }
        }
      }
    })
  }
  restart() {
    wx.triggerGC();
    this.array = PlayScene.multiArray(rows, cols);
    this.bg = new BackGround(this.ctx);
    this.gameinfo = new GameInfo();
    this.music = new Music();
    this.music.setMusicVol();
    this.padding = (this.bg.ratio - 1) * screenWidth;
    this.bindLoop = this.loop.bind(this);
    this.ranking = false;
    this.initball();
    this.next3ball();
    this.drawballs();
    this.show3balls();
    this.initEvent();
    // 清除上一局的动画
    cancelAnimationFrame(this.aniId);
    this.aniId = requestAnimationFrame(this.bindLoop);
  }
  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    let _this = this;
    _this.ctx.clearRect(0, 0, screenWidth * ratio, screenHeight * ratio);
    _this.bg.render(_this.ctx);
    _this.databus.balls
      .concat(_this.databus.topballs)
      .forEach((item) => {
        item.drawToCanvas(_this.ctx)
      });
    _this.databus.effects.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(_this.ctx)
      }
    });
    _this.gameinfo.renderGameTips(_this.ctx)
    _this.gameinfo.renderGameScore(_this.ctx, _this.databus.score)
    // 游戏结束停止帧循环
    if (_this.databus.gameOver) {
      _this.gameinfo.renderGameOver(_this.ctx, _this.databus.score)
      wx.offTouchStart();
      wx.onTouchStart((e) => {
        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;
        let area = this.gameinfo.btnArea

        if (x >= area.startX
          && x <= area.endX
          && y >= area.startY
          && y <= area.endY)
          this.replay()
      })
    }
  }

  // 游戏逻辑更新主函数
  update() {
    if (this.databus.gameOver)
      return;
    this.databus.balls
      .concat(this.databus.topballs)
      .forEach((item) => {
        item.update()
      })
  }
  // 实现游戏帧循环
  loop() {
    this.databus.frame++;

    this.update();
    this.render();
    this.aniId = requestAnimationFrame(this.bindLoop);
  }

  //给我随机数
  static give_me_num(t) {
    if (t == null || t === 1) {
      return Math.ceil(Math.random() * databus.colorNum)
    } else {
      let num_arr = [];
      for (let i = 0; i < t; i++) {
        num_arr.push(Math.ceil(Math.random() * databus.colorNum))
      }
      return num_arr
    }
  }
  //生成空数组
  static multiArray(rows, cols) {
    let a = new Array(rows);
    for (let i = 0; i < rows; i++) {
      a[i] = new Array(cols);
      for (let j = 0; j < cols; j++) {
        a[i][j] = 0;
      }
    }
    return a;
  }
  //给我一个位置
  give_me_position() {
    let arr = this.array;
    let zeros = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (arr[i][j] === 0) {
          zeros.push([i, j]);
        }
      }
    }
    if (zeros.length === 0) {
      return undefined;
    } else {
      return zeros[Math.floor(Math.random() * zeros.length)];
    }
  }
  //随机生成3个球，传入databus
  next3ball() {
    this.databus.nextnum = PlayScene.give_me_num(3);
  }

  //初始化置入小球进数组
  initball() {
    this.array = PlayScene.multiArray(rows, cols);
    for (let i = 0; i < initBallNum; i++) {
      let newPosition = this.give_me_position();
      this.array[newPosition[0]][newPosition[1]] = PlayScene.give_me_num();
    }
  }
  //置入3个小球（如果格子满，返回游戏结束，记录得分）
  put3ball() {
    let that = this;
    for (let i = 0; i <= 3; i++) {
      let new_position = that.give_me_position();
      if (new_position === undefined) {
        that.databus.gameOver = true;
        that.saveUserCloudStorage();
        break;
      } else {
        if(i<3){
          that.array[new_position[0]][new_position[1]] = that.databus.nextnum[i];
          let check_eli = that.check_eliminate(that.databus.nextnum[i], new_position[0], new_position[1]);
          if (check_eli != null) {
            that.reg_eliminate(check_eli);
            that.reg_score(check_eli);
          }
        }
      }
    }
  }

  //按数组实例化小球对象
  drawballs() {
    for (let j = 0; j < cols; j++) {
      for (let i = 0; i < rows; i++) {
        if (this.array[i][j] !== 0) {
          let ball_ = this.databus.pool.getItemByClass('ball', Ball);
          ball_.init(i, j, this.array[i][j]);
          this.databus.balls.push(ball_);
        }
      }
    }
  }
  //实例化next3小球对象
  show3balls() {
    for (let i = 0; i < 3; i++) {
      let topball_ = this.databus.pool.getItemByClass('topball', Topball);
      topball_.init(i, this.databus.nextnum[i]);
      this.databus.topballs.push(topball_)
    }
  }
  //登记消除
  reg_eliminate(count_plus) {
    let _this = this
    _this.databus.effects = [];
    for (let i = 0; i < count_plus.length; i++) {
      _this.array[count_plus[i][0]][count_plus[i][1]] = 0;
      let effect = _this.databus.pool.getItemByClass('effect', Effect);
      effect.init(itemwidth * count_plus[i][1], _this.padding + itemwidth * count_plus[i][0])
    }
    _this.databus.effects.forEach((item) => {
      item.playAnimation();
    });
    _this.music.playExplosion();
    console.log(_this.databus.effects)
  }
  //登记分数
  reg_score(count_plus) {
    let that = this
    let count_num = count_plus.length;
    let score_plus = 2 * count_num * (count_num - 10) + 60;
    that.databus.score_plus += score_plus
    console.log(that.databus.score_plus)
    for(let i=0;i<score_plus;i+=2){
      setTimeout(()=>{
        that.databus.score += 2
        that.databus.score_plus -= 2
        if (i + 2 === score_plus) {
          that.reg_maxScore();
        }
      }, 200 * i / score_plus)
      
    }
    
  }
  //更新最高分
  reg_maxScore(){
    if(this.databus.score > 1680){
      this.databus.colorNum = 7
    }else if(this.databus.score > 1480){
      this.databus.colorNum = 8
    }else if (this.databus.score > 1280) {
      this.databus.colorNum = 7
    } else if (this.databus.score > 1080) {
      this.databus.colorNum = 8
    }else if (this.databus.score > 880) {
      this.databus.colorNum = 7
    } else if (this.databus.score > 680) {
      this.databus.colorNum = 8
    }else if(this.databus.score > 450){
      this.databus.colorNum = 7
      wx.showToast({
        title: '彩色万能球即将开启！',
        duration: 1500,
        icon: "none"
      });
    }else if(this.databus.score > 280){
      this.databus.colorNum = 6
    }else if(this.databus.score > 160){
      this.databus.colorNum = 5
    }else if (this.databus.score > 80) {
      this.databus.colorNum = 4
    }
    if (this.databus.score > this.databus.maxscore) {
      this.databus.maxscore = this.databus.score;
      wx.setStorageSync('maxScore', this.databus.maxscore);
    }
    this.saveUserCloudStorage();
  }

  saveUserCloudStorage() {
    let score = this.databus.maxscore;
    // 让子域更新当前用户的最高分，因为主域无法得到getUserCloadStorage;
    let openDataContext = wx.getOpenDataContext();
    console.log("发给子域更新分数啦")
    openDataContext.postMessage({
      messageType: 2,
      text: score
    });
  }
  //检测消除
  check_eliminate(num,x,y){
    if (num === 8) {
      for (let q = 1; q < 8; q++) {
        let test_ = this.check_eliminate2(q, x, y)
        if (test_ !== null){
          return test_
        }
      }
    } else {
      return this.check_eliminate2(num, x, y)
    }
  }

  check_eliminate2(num, x, y) {
    let count1 = this.lrCount(num, x, y);
    let count2 = this.tbCount(num, x, y);
    let count3 = this.rtCount(num, x, y);
    let count4 = this.rbCount(num, x, y);
    let count_plus = [];
    if (count1 != null) {
      for (let i = 0; i < count1.length; i++) {
        count_plus.push(count1[i])
      }
    }
    if (count2 != null) {
      for (let i = 0; i < count2.length; i++) {
        count_plus.push(count2[i])
      }
    }
    if (count3 != null) {
      for (let i = 0; i < count3.length; i++) {
        count_plus.push(count3[i])
      }
    }
    if (count4 != null) {
      for (let i = 0; i < count4.length; i++) {
        count_plus.push(count4[i])
      }
    }
    if (count_plus.length !== 0) {
      return count_plus;
    } else {
      return null
    }
  }
  //从左到右
  lrCount(num, x, y) {
    let count = [];
    let arr = this.array;
    for (let j = y; j < cols; j++) {
      if (arr[x][j] === num || arr[x][j] === 8) {
        count.push([x, j]);
      } else {
        j = cols
      }
    }
    for (let j = y - 1; j >= 0; j--) {
      if (arr[x][j] === num || arr[x][j] === 8) {
        count.push([x, j]);
      } else {
        j = -1
      }
    }
    if (count.length >= 5) {
      return count
    } else {
      return null
    }
  }
  //从上到下
  tbCount(num, x, y) {
    let count = [];
    let arr = this.array;
    for (let i = x; i < rows; i++) {
      if (arr[i][y] === num || arr[i][y] === 8) {
        count.push([i, y]);
      } else {
        i = rows
      }
    }
    for (let i = x - 1; i >= 0; i--) {
      if (arr[i][y] === num || arr[i][y] === 8) {
        count.push([i, y]);
      } else {
        i = -1
      }
    }
    if (count.length >= 5) {
      return count
    } else {
      return null
    }
  }
  //从右到上
  rtCount(num, x, y) {
    let count = [];
    let arr = this.array;
    for (let i = x, j = y; i < rows && y < cols;) {
      if (arr[i][j] === num || arr[i][j] === 8) {
        count.push([i, j]);
      } else {
        i = rows
      }
      i++;
      j++;
    }
    for (let i = x - 1, j = y - 1; i >= 0 && j >= 0;) {
      if (arr[i][j] === num || arr[i][j] === 8) {
        count.push([i, j]);
      } else {
        i = -1
      }
      i--;
      j--;
    }
    if (count.length >= 5) {
      return count
    } else {
      return null
    }
  }
  //从右到下
  rbCount(num, x, y) {
    let count = [];
    let arr = this.array;
    for (let i = x, j = y; i >= 0 && j < cols;) {
      if (arr[i][j] === num || arr[i][j] === 8) {
        count.push([i, j]);
      } else {
        i = -1
      }
      i--;
      j++;
    }
    for (let i = x + 1, j = y - 1; i < rows && j >= 0;) {
      if (arr[i][j] === num || arr[i][j] === 8) {
        count.push([i, j]);
      } else {
        i = rows
      }
      i++;
      j--;
    }
    if (count.length >= 5) {
      return count
    } else {
      return null
    }
  }
  //路径检测
  finder(start, end) {
    let result = [];
    let finded = false;
    let map = this.array;
    let steps = PlayScene.multiArray(rows, cols);
    (function fn(list) {
      let next_list = [];
      let next = function(fromm, to) {
        let x = to[0],
          y = to[1];
        if (typeof steps[x] !== 'undefined' && typeof steps[x][y] !== 'undefined' && map[x][y] === 0 && !finded) {
          if (x === end[0] && y === end[1]) {
            finded = true;
            steps[x][y] = fromm;
          } else if (!steps[x][y]) {
            next_list.push(to);
            steps[x][y] = fromm;
          }
        }
      };
      for (let i = 0, l = list.length; i < l; i++) {
        let current = list[i];
        let x = current[0],
          y = current[1];
        (x - 1 >= 0) && next(current, [x - 1, y]);
        (x + 1 < cols) && next(current, [x + 1, y]);
        (y - 1 >= 0) && next(current, [x, y - 1]);
        (y + 1 < rows) && next(current, [x, y + 1]);
      }
      if (!finded && next_list.length !== 0) {
        fn(next_list);
      }
    })([start]);
    if (finded) {
      let current = end;
      while (current[0] !== start[0] || current[1] !== start[1]) {
        result.unshift(current);
        current = steps[current[0]][current[1]];
      }
    }
    console.log('移动路径', result);
    return result
  }
}