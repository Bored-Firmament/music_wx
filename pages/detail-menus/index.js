// pages/detail-menus/index.js
import { getSongMenuHot, getSongMenu } from "../../service/music_api"

Page({
  data: {
    hotSongMenuList: []
  },
  onLoad: function () {
    this.getPageData();
  },
  async getPageData() {
    const res = await getSongMenuHot();
    const hotSongMenuTag = res.tags;
    const hotSongMenuList = [];
    const promises = [];
    for(const index in hotSongMenuTag) {
      const name = hotSongMenuTag[index].name;
      hotSongMenuList[index] = { name, list: [] };
      promises.push(getSongMenu(name));
    }
    Promise.all(promises).then(menuLists => {
      for(const index in menuLists) {
        hotSongMenuList[index].list = menuLists[index].playlists
      }
      this.setData({ hotSongMenuList });
    })
  }
})