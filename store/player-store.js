import { HYEventStore } from "hy-event-store"
import { getSongDetail, getSongLyric } from "../service/player_api"
import parseLyric from "../utils/parse-lyric"

const audioContext = wx.createInnerAudioContext();

const playerStore = new HYEventStore({
  state: {
    id: 0,
    currentSong: {},      // 歌曲 - 基本信息
    lyrics: [],           // 歌曲 - 歌词列表
    songDuration: 0,      // 歌曲 - 进度条最大值(歌曲长度)

    currentSecond: 0,     // 歌曲当前
    currentTime: 0,       // 当前时间点
    currentLyric: '',     // 当前歌词
    currentLyricIndex: 0, // 当前歌词序号

    isPlaying: false,     // 是否播放
    playModeIndex: 0,     // 播放模式; 0: 循环播放, 1: 单曲循环, 2: 随机播放;
  },
  actions: {
    playSongAction(ctx, { id }) {
      // 保存id
      ctx.id = id;
      // 根据id 请求数据
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0];
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
      this.dispatch("setupAudioContextAction")
    },

    setupAudioContextAction(ctx) {
      // 尽管已经配置了[audioContext.autoplay = true],但为以防万一还是 onCanplay() 一下;
      // 1.监听知否可以播放
      audioContext.onCanplay(() => {
        this.dispatch("changeMusicPlayStatusAction", { isPlaying : true })
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
    },

    changeMusicPlayStatusAction(ctx, { isPlaying }) {
      ctx.isPlaying = isPlaying;
      isPlaying ? audioContext.play() : audioContext.pause();
    }
  }
})

export {
  audioContext,
  playerStore
}