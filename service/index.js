const BASE_URL = 'http://123.207.32.32:9001'

class XXRequest {
  request(path, method, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: BASE_URL + path,
        method: method,
        data: data,
        success: res => res.statusCode === 200 ? resolve(res.data) :resolve(res),
        fail: err => reject(err)
        // 【fail: err => reject(err)】可简写为【fail: reject】
        // 【fail: err => reject(err)】：请求失败触发fail,调用其回调函数【err => reject(err)】,该函数又调用【reject(err)】
        // 【fail: reject】：请求失败触发fail,直接调用【reject(err)】
      })
    })
  }

  get(path, params) {
    return this.request(path, 'GET', params)
  }
  
  post(path, data) {
    return this.request(path, 'POST', data)
  }
}

export default new XXRequest();