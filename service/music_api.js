import xxRequest from './index';

export function getBanners() {
  return xxRequest.get('/banner',{
    type: 2
  })
}

export function getRanking(idx) {
  return xxRequest.get('/top/list',{
    idx
  })
}