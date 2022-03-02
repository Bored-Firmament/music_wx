// pages/music-player/index.js
import { getSongDetail, getSongLyric } from "../../service/player_api"
import { audioContext } from "../../store/index"
import parseLyric from "../../utils/parse-lyric"

Page({
  data: {
    id: '',               // 歌曲id
    currentSong: {},      // 当前歌曲
    sliderLength: 0,      // 进度条最大值
    sliderValue: 0,       // 进度条当前值
    currentTime: 0,       // 歌曲当前时间点
    lyrics: [],           // 歌词列表
    currentLyric: '',     // 当前歌词
    currentLyricIndex: 0, // 当前歌词序号

    isShowMusicLyric: true, // 是否展示 歌曲中的歌词
    contentHeight: 0,     // 页面内容高度
    currentPage: 0,       // 当前展示内容(歌曲/歌词)
    isSliderChanging: false, // 是否 在拖动进度条
    btnMode: 'resume',
  },
  
  // 生命周期
  onLoad: function (options) {
    // 保存id
    const index = options.id.indexOf(',');
    const id = index === -1 ? options.id : options.id.slice(0, index);
    // const id = options.id;
    this.setData({ id });
    // 请求数据
    this.getPageData();
    // 动态计算内容高度
    const globalData = getApp().globalData;
    const screenHeight = globalData.screenHeight;
    const statusBarHeight = globalData.statusBarHeight;
    const navBarHeight = globalData.navBarHeight;
    const deviceRatio = globalData.deviceRatio;
    const contentHeight = screenHeight - statusBarHeight - navBarHeight;
    this.setData({ contentHeight, isShowMusicLyric : deviceRatio >= 2})

    // 播放
    audioContext.stop();
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
    // 尽管已经配置了[audioContext.autoplay = true],但为以防万一还是 onCanplay() 一下;
    audioContext.onCanplay(() => {
      audioContext.play();
      this.setData({ btnMode : 'pause' })
    })

    audioContext.onTimeUpdate(() => {
      const second = audioContext.currentTime;
      // 设置 歌曲当前时间、歌曲进度条值
      if(!this.data.isSliderChanging) {
        this.setData({ currentTime : second * 1000, sliderValue : Math.round(second)})
      }

      // 设置歌词
      if(this.data.isShowMusicLyric) {
        const lyrics = this.data.lyrics;
        const length = lyrics.length;
        for(let i = 0 ; i < length ; i++) {
          if(this.data.currentTime > lyrics[i].time) {
            if( i === length - 1 ){
              if(this.data.currentLyricIndex === i) break; 
              this.setData({ currentLyric : lyrics[i].text, currentLyricIndex : i})
              break;
            }
            continue;
          }
          if(this.data.currentLyricIndex === i - 1) break; 
          this.setData({ currentLyric : lyrics[i - 1].text, currentLyricIndex : i - 1 });
          break;
        }
      }
    })
  },

  // 事件
  handleChangeCurrent(event) {
    this.setData({ currentPage : event.detail.current });
  },
  handleClickItem(event) {
    this.setData({ currentPage : event.currentTarget.dataset.current });
  },
  bandleSliderChange(event) {
    this.pause()
    const value = event.detail.value;
    audioContext.seek(value)
    this.setData({ sliderValue: value })
    this.setData({ currentTime: value * 1000 })
    this.resume()
    this.setData({ isSliderChanging: false })
  },
  handleSliderChanging(event) {
    this.setData({ isSliderChanging : true})
    this.setData({ currentTime : event.detail.value * 1000 })
  },

  handleModeClick() {
    if(audioContext.paused) this.resume()
    else this.pause()
  },

  // 方法
  getPageData() {
    getSongDetail(this.data.id).then(res => {
      this.setData({ 
        currentSong : res.songs[0], 
        sliderLength : Number.parseInt(res.songs[0].dt / 1000),
      })
    })

    getSongLyric(this.data.id).then(res => {
      const stringLyric = res.lrc.lyric;
      const lyrics = parseLyric(stringLyric);
      this.setData({ lyrics })
    })
  },

  // 播放
  resume() {
    audioContext.play()
    this.setData({ btnMode : 'pause' })
  },
  // 暂停
  pause() {
    audioContext.pause()
    this.setData({ btnMode : 'resume' })
  },
})