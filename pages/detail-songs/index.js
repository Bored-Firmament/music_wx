// pages/detail-songs/index.js
import { rankingStore, rankingMap, playerStore } from "../../store/index"

import { getSongMenuDetail } from "../../service/music_api"

Page({
  data: {
    type: "",
    ranking: "",
    songsInfo: {},
  },
  onLoad: function (options) {
    const type = options.type;
    this.setData({ type })
    
    if(type === "rank") {
      const ranking = rankingMap[options.idx];
      this.setData({ ranking });
      console.log(ranking);
      rankingStore.onState(ranking, this.getRankingData)
    }else if(options.type === "menu") {
      getSongMenuDetail(options.id).then(res => {
        this.setData({ songsInfo: res.playlist })
      })
    }
  },
  onUnload: function () {
    if (this.data.ranking) {
      rankingStore.offState(this.data.ranking, this.getRankingData)
    }
  },
  // 事件
  handleSongItemClick(event) {
    playerStore.setState("songsList", this.data.songsInfo.tracks)
    playerStore.setState("currentSongIndex", event.currentTarget.dataset.index)
  },

  // 方法
  getRankingData(res) {
    this.setData({ songsInfo: res })
  }
})