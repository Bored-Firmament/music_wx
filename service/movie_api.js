import xxRequest from './index';

/**
 * 获取mv的数据列表
 * @param {Number} offset 获取mv数据的偏移量(起始值)
 * @param {Number} limit 获取mv数据的数量
 */
export function getTopMVs(offset, limit = 10) {
  return xxRequest.get('/top/mv', {
    offset,
    limit
  })
}

/**
 * 获取mv资源的链接
 * @param {Number} id 根据 id 获取
 */
export function getMVURL(id) {
  return xxRequest.get('/mv/url', {
    id
  })
}
/**
 * 获取mv资源的基本信息
 * @param {Number} mvid 根据 mvid(id) 获取
 */
export function getMVDetail(mvid) {
  return xxRequest.get('/mv/detail', {
    mvid
  })
}
/**
 * 获取mv的相关视频数据
 * @param {Number} id 根据 id 获取
 */
export function getRelatedVideo(id) {
  return xxRequest.get('/related/allvideo', {
    id
  })
}