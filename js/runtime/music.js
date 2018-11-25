import Databus from '../databus.js'
let instance
let databus = new Databus()
/**
 * 统一的音效管理器
 */
export default class Music {
  constructor() {
    if ( instance )
      return instance

    instance = this
    // this.scoreAudio = wx.createInnerAudioContext()
    // this.scoreAudio.src = 'audio/score.mp3'

    this.shootAudio = wx.createInnerAudioContext()
    this.shootAudio.src = 'audio/noway3.mp3'

    this.boomAudio = wx.createInnerAudioContext()
    this.boomAudio.src = 'audio/boom4.mp3'

    this.focusAudio = wx.createInnerAudioContext()
    this.focusAudio.src = 'audio/focus.mp3'
//引入8个钢琴声音
    this.focusAudio_1 = wx.createInnerAudioContext()
    this.focusAudio_1.src = 'audio/do.mp3'

    this.focusAudio_2 = wx.createInnerAudioContext()
    this.focusAudio_2.src = 'audio/re.mp3'

    this.focusAudio_3 = wx.createInnerAudioContext()
    this.focusAudio_3.src = 'audio/mi.mp3'

    this.focusAudio_4 = wx.createInnerAudioContext()
    this.focusAudio_4.src = 'audio/fa.mp3'

    this.focusAudio_5 = wx.createInnerAudioContext()
    this.focusAudio_5.src = 'audio/so.mp3'

    this.focusAudio_6 = wx.createInnerAudioContext()
    this.focusAudio_6.src = 'audio/la.mp3'

    this.focusAudio_7 = wx.createInnerAudioContext()
    this.focusAudio_7.src = 'audio/si.mp3'

    this.focusAudio_8 = wx.createInnerAudioContext()
    this.focusAudio_8.src = 'audio/do4.mp3'

    this.setMusicVol()
  }
  setMusicVol(){
    let volset = parseInt(databus.vol)
    // this.scoreAudio.volume = volset
    this.shootAudio.volume = volset
    this.boomAudio.volume = volset
    this.focusAudio.volume = volset
    this.focusAudio_1.volume = volset
    this.focusAudio_2.volume = volset
    this.focusAudio_3.volume = volset
    this.focusAudio_4.volume = volset
    this.focusAudio_5.volume = volset
    this.focusAudio_6.volume = volset
    this.focusAudio_7.volume = volset
    this.focusAudio_8.volume = volset
  }
  playShoot() {
    this.shootAudio.stop()
    this.shootAudio.play()
  }
  // playScore(){
  //   this.scoreAudio.stop()
  //   this.scoreAudio.play()
  // }
  playExplosion() {
    this.boomAudio.stop()
    this.boomAudio.play()
  }
  stopAudio(){
    this.focusAudio_1.stop()
    this.focusAudio_2.stop()
    this.focusAudio_3.stop()
    this.focusAudio_4.stop()
    this.focusAudio_5.stop()
    this.focusAudio_6.stop()
    this.focusAudio_7.stop()
    this.focusAudio_8.stop()
  }
  playFocus() {
    switch (Math.floor(Math.random() * 8 + 1)) {
      case 1:
        this.stopAudio();
        this.focusAudio_1.play();
        break;
      case 2:
        this.stopAudio();
        this.focusAudio_2.play();
        break;
      case 3:
        this.stopAudio();
        this.focusAudio_3.play();
        break;
      case 4:
        this.stopAudio();
        this.focusAudio_4.play();
        break;
      case 5:
        this.stopAudio();
        this.focusAudio_5.play();
        break;
      case 6:
        this.stopAudio();
        this.focusAudio_6.play();
        break;
      case 7:
        this.stopAudio();
        this.focusAudio_7.play();
        break;
      case 8:
        this.stopAudio();
        this.focusAudio_8.play();
        break;
    }
  }
  playFocus2() {
    this.focusAudio.stop();
    this.focusAudio.play();
  } 
}
