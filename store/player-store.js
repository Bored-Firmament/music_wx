import { HYEventStore } from "hy-event-store"
import { getSongDetail, getSongLyric } from "../service/player_api"
import parseLyric from "../utils/parse-lyric"

const audioContext = wx.getBackgroundAudioManager();

const playerStore = new HYEventStore({
  state: {
    isFirstPlay: true,   // 是否是第一次点击,只有第一次点击需要生成对 audioContext 的监听函数

    id: 0,
    currentSong: {},      // 歌曲 - 基本信息
    lyrics: [],           // 歌曲 - 歌词列表
    songDuration: 0,      // 歌曲 - 进度条最大值(歌曲长度)

    songsList: [],        // 歌曲 - 列表
    currentSongIndex: 0,  // 当前歌曲索引

    currentSecond: 0,     // 歌曲当前
    currentTime: 0,       // 当前时间点
    currentLyric: '',     // 当前歌词
    currentLyricIndex: 0, // 当前歌词序号

    isPlaying: false,     // 是否播放
    playModeIndex: 0,     // 播放模式; 0: 循环播放, 1: 单曲循环, 2: 随机播放;
  },
  actions: {
    playSongAction(ctx, { id, isRefresh = false }) {
      console.log(ctx.id, id);
      if(ctx.id == id && !isRefresh) {
        this.dispatch("changeMusicPlayStatusAction");
        return
      }
      // 初始化(避免上一个音乐的数据干扰新的音乐的数据)
      if(ctx.id !== id) {
        ctx.id = id;
        ctx.currentSong = {};
        ctx.lyrics = [];
        ctx.songDuration = 0;
      }
      ctx.currentSecond = 0;
      ctx.currentTime = 0;
      ctx.currentLyric = '';
      ctx.currentLyricIndex = 0;

      // 根据id 请求数据
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0];
        audioContext.title = res.songs[0].name;
        ctx.songDuration = Number.parseInt(res.songs[0].dt / 1000);
      })
      getSongLyric(id).then(res => {
        const stringLyric = res.lrc.lyric;
        const lyrics = parseLyric(stringLyric);
        ctx.lyrics = lyrics;
      })

      // 播放
      audioContext.stop();
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
      audioContext.autoplay = true;

      // 监听 audioContext 的一些事件
      if(ctx.isFirstPlay) {
        this.dispatch("setupAudioContextAction");
        ctx.isFirstPlay = false;
      }
    },

    setupAudioContextAction(ctx) {
      // 尽管已经配置了[audioContext.autoplay = true],但为以防万一还是 onCanplay() 一下;
      // 1.监听知否可以播放
      audioContext.onCanplay(() => {
        this.dispatch("changeMusicPlayStatusAction")
      })
      
      // 2.监听音频的时间变化
      audioContext.onTimeUpdate(() => {
        const second = audioContext.currentTime;
        const currentMilliSecond = second * 1000
        // 记录 歌曲当前时间
        ctx.currentTime =  currentMilliSecond;
        ctx.currentSecond =  Math.round(second);

        // 设置歌词
        if(!ctx.lyrics.length) return
        const lyrics = ctx.lyrics;
        const length = lyrics.length;
        let i = 0;
        if(i = 0) {
          ctx.currentLyricIndex = 0;
          ctx.currentLyric = lyrics[0];
        }
        for(; i < length ; i++) {
          if(currentMilliSecond < lyrics[i].time) break;
        }
        const currentIndex = i - 1;
        if (ctx.currentLyricIndex !== currentIndex) {
          const currentLyricInfo = lyrics[currentIndex];
          ctx.currentLyricIndex = currentIndex;
          ctx.currentLyric = currentLyricInfo.text;
        }
      })

      // 3.监听当前音频是否结束
      audioContext.onEnded(() => {
        this.dispatch("changeNewSongAction");
      })

      // 4.监听音乐暂停/播放/停止
      // 播放状态
      audioContext.onPlay(() => {
        ctx.isPlaying = true
      })
      // 暂停状态
      audioContext.onPause(() => {
        ctx.isPlaying = false
      })
      audioContext.onStop(() => {
        ctx.isPlaying = false
        
        ctx.currentSecond = 0;
        ctx.currentTime = 0;
        ctx.currentLyric = '';
        ctx.currentLyricIndex = 0;
      })
      audioContext.onPrev(() => {
        this.dispatch("changeNewSongAction", { isNext: false, isEnded: false })
      })
      audioContext.onNext(() => {
        this.dispatch("changeNewSongAction", { isNext: true, isEnded: false })
      })
    },

    changeMusicPlayStatusAction(ctx, isPlaying = true ) {
      ctx.isPlaying = isPlaying;
      if (ctx.isPlaying) {
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
        audioContext.title = ctx.currentSong.name
      }
      isPlaying ? audioContext.play() : audioContext.pause();
    },

    changeNewSongAction(ctx, payload = { isNext: true, isEnded: true }) {
      let index = ctx.currentSongIndex;

      switch(ctx.playModeIndex) {
        case 0: 
          // 列表循环、单曲循环
          index = payload.isNext ? index + 1 : index - 1;
          if(index === ctx.songsList.length) index = 0;
          if(index === -1) index = ctx.songsList.length - 1;
          break;
        case 1: 
          if(!payload.isEnded) {
            index = payload.isNext ? index + 1 : index - 1;
            if(index === ctx.songsList.length) index = 0;
            if(index === -1) index = ctx.songsList.length - 1;
          }
          break;
        case 2: 
          // 随机播放
          // 列表不是只有一条歌曲,否则就不存在随机新歌的可能了
          if(ctx.songsList.length !== 1){
            // 下一首歌在列表中的索引 与 当前歌的索引 一致,重新随机!
            do{
              index = Math.floor(Math.random() * ctx.songsList.length);
            }while(index === ctx.currentSongIndex);
          }
          break;
      }
      this.dispatch("playSongAction", { id : ctx.songsList[index].id, isRefresh : true });
      ctx.currentSongIndex = index;
    }
  }
})

export {
  audioContext,
  playerStore
}