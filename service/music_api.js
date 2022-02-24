import xxRequest from './index';

export function getBanners() {
  return xxRequest.get('/banner',{
    type: 2
  })
}