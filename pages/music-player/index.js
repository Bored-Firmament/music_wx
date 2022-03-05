// pages/music-player/index.js
import { playerStore, audioContext } from "../../store/index"

const playModeNames = ["order", "repeat", "random"]

Page({
  data: {
    songsList: [],        // 歌曲列表
    currentSong: {},      // 当前歌曲 store
    lyrics: [],           // 歌词列表 store
    songDuration: 0,      // 进度条最大值 store
    // 歌曲当前时间 - 相关数据
    currentSecond: 0,     // 进度条当前值 store
    currentTime: 0,       // 歌曲当前时间点 store
    currentLyric: '',     // 当前歌词 store
    currentLyricIndex: 0, // 当前歌词序号 store
    // 页面独有数据
    isShowMusicLyric: true, // 是否展示 歌曲中的歌词
    contentHeight: 0,       // 页面内容高度
    currentPage: 0,         // 当前展示内容(歌曲/歌词)
    isSliderChanging: false,// 是否 在拖动进度条
    isPlaying: false,       // 是否播放 store
    playStatus: 'resume',   // 播放状态图标
    playModeIndex: 0,       // 播放模式索引 store
    playModeName: 'order',  // 播放模式图标

    lyricBottom: 0,     // 歌词页-下空白
    lyricTop: 0,        // 歌词页-上空白
    scrollTop: 0,       // 歌词页-滚动距离(让当前歌词能够居中)

    isShowSongsList: false, // 是否显示歌曲列表
  },
  
  // 生命周期
  onLoad: function (options) {
    playerStore.dispatch('playSongAction',{ id : options.id })

    this.getStoreData();
    
    // 动态计算内容高度
    const globalData = getApp().globalData;
    const screenHeight = globalData.screenHeight;
    const statusBarHeight = globalData.statusBarHeight;
    const navBarHeight = globalData.navBarHeight;
    const deviceRatio = globalData.deviceRatio;
    const contentHeight = screenHeight - statusBarHeight - navBarHeight;
    this.setData({ contentHeight, isShowMusicLyric : deviceRatio >= 2})
    // 歌词页-上下空白
    const lyricBottom = screenHeight / 2 - 15;
    const lyricTop = contentHeight - (screenHeight / 2) - 15;
    this.setData({ lyricBottom, lyricTop })
  },

  // ================================================== 事件 ==================================================
  handleChangeCurrentPage(event) {
    this.setData({ currentPage : event.detail.current });
  },
  handleTabItemClick(event) {
    this.setData({ currentPage : event.currentTarget.dataset.current });
  },
  bandleSliderChange(event) {
    this.setData({ isSliderChanging : true})
    // 拿到 新的歌曲进度
    const value = event.detail.value;
    // 将 音频 跳转到 新的歌曲进度
    audioContext.seek(value);
    // 修改当前的 歌曲进度数据(不能修改进度条)
    this.setData({ currentTime: value * 1000 });
    // 设置为 没有拖拽 让[audioContext.onTimeUpdate()]可以正常保持 视图 对应的 歌曲进度 显示
    this.setData({ isSliderChanging: false });
  },
  handleSliderChanging(event) {
    this.setData({ isSliderChanging : true})
    this.setData({ currentTime : event.detail.value * 1000 })
  },

  changePlayModeClick() {
    let playModeIndex = this.data.playModeIndex + 1;
    playModeIndex = playModeIndex === 3 ? 0 : playModeIndex;
    playerStore.setState("playModeIndex", playModeIndex)
  },
  changePlayStatusClick() {
    if(audioContext.paused) this.resume();
    else this.pause();
  },
  prevSongClick() {
    playerStore.dispatch("changeNewSongAction", { isNext: false, isEnded: false });
  },
  nextSongClick() {
    playerStore.dispatch("changeNewSongAction", { isNext: true, isEnded: false });
  },
  isSongsListClick() {
    this.setData({ isShowSongsList: !this.data.isShowSongsList })
  },
  // ================================================== 方法 ==================================================
  // store 相关
  getStoreData() {
    // 获取 共享数据
    playerStore.onStates([ "songsList", "currentSong", "lyrics", "songDuration"], ({ songsList, currentSong, lyrics, songDuration }) => {
      if(songsList) {
        this.setData({ songsList })
      }
      if(currentSong) this.setData({ currentSong });
      if(lyrics) this.setData({ lyrics });
      if(songDuration !== undefined) this.setData({ songDuration });
    })
    playerStore.onStates(["currentTime", "currentSecond", "currentLyric", "currentLyricIndex"], ({ currentTime, currentSecond, currentLyric, currentLyricIndex}) => {
      if(currentTime !== undefined && !this.data.isSliderChanging) this.setData({ currentTime });
      if(currentSecond !== undefined && !this.data.isSliderChanging) this.setData({ currentSecond });
      if(currentLyric !== undefined) this.setData({ currentLyric });
      if(currentLyricIndex !== undefined) this.setData({ currentLyricIndex, scrollTop : currentLyricIndex * 60 });
    })
    playerStore.onStates(["isPlaying", "playModeIndex"], ({ isPlaying, playModeIndex }) => {
      if(isPlaying !== undefined) {
        this.setData({ isPlaying, playStatus :(isPlaying ? 'pause' : 'resume') });
      }
      if(playModeIndex !== undefined) {
        let playModeName = playModeNames[playModeIndex];
        this.setData({ playModeIndex, playModeName });
      }
    })
  },
  // 播放
  resume() { 
    playerStore.dispatch("changeMusicPlayStatusAction");
  },
  // 暂停
  pause() { 
    playerStore.dispatch("changeMusicPlayStatusAction", false );
  },
})