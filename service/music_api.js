import xxRequest from './index';

export function getBanners() {
  return xxRequest.get('/banner', {
    type: 2
  })
}

export function getRanking(idx) {
  return xxRequest.get('/top/list', {
    idx
  })
}

export function getSongMenu(cat = "全部", limit = 6, offset = 0) {
  return xxRequest.get('/top/playlist', {
    cat,
    limit,
    offset
  })
}