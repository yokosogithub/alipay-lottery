import Vue from 'vue'
import App from './App'


Vue.config.productionTip = false

App.mpType = 'app'

// 请求封装
const apipost = (url, params,method='post')=>{
	// 判断是否有token,没有则登录
	return new Promise((resolve, reject) => {
		uni.request({
			url: 'https://block.chain.pro/discovery-ad' + url, //仅为示例，并非真实接口地址。
			data: params,
			method:method,
			// header: {
			// 	'Authorization': uni.getStorageSync('access-token') //自定义请求头信息
			// },
			success (res) {
				resolve(res.data)
			},
			fail (err) {
				reject(err.data)
			}
		});
	});
}

Vue.prototype.$api = { apipost };

const app = new Vue({
    ...App
})
app.$mount()
