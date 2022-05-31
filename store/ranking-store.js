import { HYEventStore } from "hy-event-store"

import { getRanking } from "../service/music_api"

const rankingMap = {
  3779629: 'newRanking',
  3778678: 'hotRanking',
  2884035: 'originRanking',
  19723756: 'upRanking'
}

const rankingStore = new HYEventStore({
  state: {
    newRanking: {}, // 0.新歌
    hotRanking: {}, // 1.热歌
    originRanking: {}, // 2.原创
    upRanking: {}, // 3.飙升
  },
  actions: {
    getRankingDataAction(ctx) {
      for(let key of Object.keys(rankingMap)) {
        getRanking(key).then(res => {
          ctx[rankingMap[key]] = res.playlist;
        })
      }
    }
  }
})

export {
  rankingStore,
  rankingMap
}