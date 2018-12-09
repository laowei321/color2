let sharedCanvas = wx.getSharedCanvas();
let context = sharedCanvas.getContext('2d');

const screenWidth = wx.getSystemInfoSync().screenWidth;
const screenHeight = wx.getSystemInfoSync().screenHeight;
const ratio = wx.getSystemInfoSync().pixelRatio;
const scales = screenWidth / 750;
// const firstPic = wx.createImage();
// firstPic.src = 'src/myOpenDataContext/first.png'; 
// const secondPic = wx.createImage();
// secondPic.src = 'src/myOpenDataContext/second.png'; 
// const thirdPic = wx.createImage();
// thirdPic.src = 'src/myOpenDataContext/third.png'; 
let itemCanvas = wx.createCanvas();
let ctx = itemCanvas.getContext('2d');

let myScore = undefined;
let myInfo = {};
let myRank = undefined;
initEle();
getUserInfo();

// 初始化标题返回按钮等元素...清理区域
function initEle() {
  context.restore();
  context.scale(ratio, ratio);
  context.clearRect(0, 0, screenWidth * ratio, screenHeight * ratio);
  // 画背景
  context.fillStyle = 'rgba(0, 0, 0, 0.3)';
  context.fillRect(0, 0, screenWidth * ratio, screenHeight * ratio);
  // 按照 750的尺寸绘制
  
  context.scale(scales, scales);
  // 排名列表外框
  context.fillStyle = '#302F30';
  context.fillRect(80, 290, 750 - 80 * 2, 650);

  // 排行榜提示
  context.fillStyle = '#8D8D8D';
  context.font = '20px Arial';
  context.textAlign = 'left';
  context.fillText('嗯,看看你跟别人的差距~', 100, 340);

  // 自己排名外框
  context.fillStyle = '#302F30';
  context.fillRect(80, 960, 750 - 80 * 2, 120);

}
function drawTitle(num){
  // 画标题 loading 与 返回按钮
  let qunyouImage = wx.createImage();
  qunyouImage.src = 'src/myOpenDataContext/qunyou.png';
  let haoyouImage = wx.createImage();
  haoyouImage.src = 'src/myOpenDataContext/haoyou.png';
  let loadingImage = wx.createImage();
  loadingImage.src = 'src/myOpenDataContext/loading.png';
  if(num === 1){
    haoyouImage.onload = () => {
      context.drawImage(haoyouImage, 69, 205, 612, 105);
    }
  }else{
    qunyouImage.onload = () => {
      context.drawImage(qunyouImage, 69, 205, 612, 105);
    }
  }
  loadingImage.onload = () => {
    context.drawImage(loadingImage, 235, 600, 280, 48);
  }
  // 返回按钮
  let returnImage = wx.createImage();
  returnImage.src = 'images/return.png';
  returnImage.onload = () => {
    context.drawImage(returnImage, 80, 1120, 100, 100);
  };
}

function initRanklist(list) {
  // 至少绘制6个
  if(list && list.length > 50){
    list = list.slice(0,50)
  }
  let length = Math.max(list.length, 6);
  let itemHeight = 590 / 6;

  // itemCanvas.width = screenWidth - 40 * 2;
  // itemCanvas.height = itemHeight * length;
  itemCanvas.width = (750 - 80 * 2);
  itemCanvas.height = itemHeight * length;

  ctx.clearRect(0, 0, itemCanvas.width, itemCanvas.height);

  for (let i = 0; i < length; i++) {
    if (i % 2 === 0) {
      ctx.fillStyle = '#393739';
    } else {
      ctx.fillStyle = '#302F30';
    }
    ctx.fillRect(0, i * itemHeight, itemCanvas.width, itemHeight);
  }

  if (list && list.length > 0) {
    list.map((item, index) => {
      let avatar = wx.createImage();
      avatar.src = item.avatarUrl;
      ctx.fillStyle = '#fff';
      ctx.font = '28px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(item.nickname, 190, index * itemHeight + 54);
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(item.score || 0, 550, index * itemHeight + 60);
      ctx.font = 'italic 44px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(index + 1, 46, index * itemHeight + 64)
      switch (index){
        case 0:
          let firstPic = wx.createImage();
          firstPic.src = 'src/myOpenDataContext/first.png';
          firstPic.onload = () => {
            ctx.drawImage(firstPic, 0, index * itemHeight, 100, 100);
          }
          break;
        case 1:
          let secondPic = wx.createImage();
          secondPic.src = 'src/myOpenDataContext/second.png';
          secondPic.onload = () => {
            ctx.drawImage(secondPic, 0, index * itemHeight, 100, 100);
          }
          break;
        case 2:
          let thirdPic = wx.createImage();
          thirdPic.src = 'src/myOpenDataContext/third.png'; 
          thirdPic.onload = () => {
            ctx.drawImage(thirdPic, 0, index * itemHeight, 100, 100);
          }
          break;
      }
      avatar.onload = function () {
        ctx.drawImage(avatar, 100, index * itemHeight + 14, 70, 70);
        reDrawItem(0);
      };
    });
  } else {
    // 没有数据
  }
  reDrawItem(0);
}

// 绘制自己的排名
function drawMyRank() {
  // 自己排名外框
  context.clearRect(80, 960, 750 - 80 * 2, 120);
  context.fillStyle = '#302F30';
  context.fillRect(80, 960, 750 - 80 * 2, 120);
  if (myInfo.avatarUrl && myScore) {
    let avatar = wx.createImage();
    avatar.src = myInfo.avatarUrl;
    avatar.onload = function () {
      context.drawImage(avatar, 180, 960 + 24, 70, 70);
    };
    context.fillStyle = '#fff';
    context.font = '28px Arial';
    context.textAlign = 'left';
    context.fillText(myInfo.nickName, 270, 960 + 72);
    context.font = 'bold 36px Arial';
    context.textAlign = 'right';
    context.fillText(myScore || 0, 630, 960 + 76);
    // 自己的名次
    if (myRank !== undefined) {
      context.font = 'italic 44px Arial';
      context.textAlign = 'center';
      context.fillText(myRank, 126, 960 + 80);
    }
    
  }
  // context.fillRect(40, 480, screenWidth - 40 * 2, 60);
}
// 因为头像绘制异步的问题，需要重新绘制
function reDrawItem(y) {
  context.clearRect(80, 350, 750 - 80 * 2, 590);
  context.fillStyle = '#302F30';
  context.fillRect(80, 350, 750 - 80 * 2, 590);
  context.drawImage(itemCanvas, 0, y, 750 - 80 * 2, 590, 80, 350, 750 - 80 * 2, 590);
  //
  // context.drawImage(itemCanvas, 40, y+175, screenWidth - 40 * 2, 295);
}
function sortByScore(data) {
  let array = [];
  data.forEach((item) => {
    array.push({
      avatarUrl: item.avatarUrl,
      nickname: item.nickname.length <= 9 ? item.nickname : item.nickname.substring(0, 9)+'...',
      openid: item.openid,
      score: item['KVDataList'][1] && item['KVDataList'][1].value !== 'undefined' ? item['KVDataList'][1].value : (item['KVDataList'][0] ? item['KVDataList'][0].value : 0) // 取最高分
    })
  });
  array.sort((a, b) => {
    if (a.score == 0 && b.score == 0) {
      return 0;
    }
    if (a.score == 0) {
      return 1;
    }
    if (b.score == 0) {
      return -1;
    }
    return b.score - a.score
  });
  getMyRank(array);
  return array;
}
function getMyRank(array){

  myRank = array.findIndex((item) => {
    return item.avatarUrl === myInfo.avatarUrl;
  });
  if (myRank === -1)
    {myRank = array.length;}
  else{myRank += 1}

}

// 开放域的getUserInfo 不能获取到openId, 可以在主域获取，并从主域传送
function getUserInfo() {
  wx.getUserInfo({
    openIdList: ['selfOpenId'],
    lang: 'zh_CN',
    success: res => {
      myInfo = res.data[0];
    },
    fail: res => {
    }
  })
}

// 获取自己的分数
function getMyScore(num) {
  wx.getUserCloudStorage({
    keyList: ['score', 'maxScore'],
    success: res => {
      console.log(res)
      console.log("check my score")
      let data = res.KVDataList;
      let lastScore
      if(data.length===0){
        wx.setUserCloudStorage({
          KVDataList: [{ 'key': 'score', 'value': ('' + num) }],
          success: res => {
            console.log(res);
          },
          fail: res => {
            console.log(res);
          }
        });
        lastScore = num
      }else{
        lastScore = data[0].value || 0;
        if (num > lastScore) {
          lastScore = num
          wx.setUserCloudStorage({
            KVDataList: [{ 'key': 'score', 'value': ('' + lastScore) }],
            success: res => {
              console.log(res);
            },
            fail: res => {
              console.log(res);
            }
          });
        }
        if (!data[1]) {
          saveMaxScore(lastScore);
          myScore = lastScore;
        } else if (lastScore > data[1].value) {
          saveMaxScore(lastScore);
          myScore = lastScore;
        } else {
          myScore = data[1].value;
        }
      }
    },
    fail: res => {
      console.log(res);
    }
  });
}

function saveMaxScore(maxScore) {
  wx.setUserCloudStorage({
    KVDataList: [{ 'key': 'maxScore', 'value': ('' + maxScore) }],
    success: res => {
      console.log("save cloudmaxScore success")
      console.log(res);
    },
    fail: res => {
      console.log(res);
    }
  });
}

function getFriendsRanking() {
  drawTitle(1);
  wx.getFriendCloudStorage({
    keyList: ['maxScore'],
    success: res => {
      let data = res.data;
      initRanklist(sortByScore(data));
      drawMyRank();
    }
  });
}

function getGroupRanking(ticket) {
  drawTitle(2);
  wx.getGroupCloudStorage({
    shareTicket: ticket,
    keyList: ['maxScore'],
    success: res => {
      console.log('getGroupCloudStorage:success');
      // console.log(res.data);
      let data = res.data;
      initRanklist(sortByScore(data));
      drawMyRank();
    },
    fail: res => {
      console.log('getGroupCloudStorage:fail');
      // console.log(res.data);
    }
  });
}
wx.onMessage(data => {
  if (data.messageType === 1) {                     //获取好友排行
    getMyScore(0);                   
    getFriendsRanking();
  }
  else if (data.messageType === 2) {                //更新最高分
    getMyScore(data.text);
  }
  else if (data.messageType === 3) {                //获取好友群排行
    getMyScore(0); 
    getGroupRanking(data.text);
    console.log("onMessage from master get group");
  }
  else if (data.messageType === 4) {                //设置简单排行榜，显示前一名和后一名
    // getLastAndNextFriend(data.keyValue);
    console.log("onMessage from master get group2");
  }
});

let startY = undefined, moveY = 0;
// 触摸移动事件
wx.onTouchMove(e => {
  let touch = e.touches[0];
  // 触摸移动第一次触发的位置
  if (startY === undefined) {
    startY = touch.clientY + moveY;
  }
  moveY = startY - touch.clientY;
  reDrawItem(moveY);
});
wx.onTouchEnd(e => {
  startY = undefined;
  if (moveY < 0) { // 到顶
    moveY = 0;
  } else if (moveY > itemCanvas.height - 590) { // 到底
    moveY = itemCanvas.height - 590;
  }
  reDrawItem(moveY);
});