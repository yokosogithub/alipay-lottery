import axios from './axios'
import store from '@/vuex'
import { getLanguage } from './common'

let needLoadingRequestCount = 0

const startLoading = () => {
	console.log('showLoading =============')
	store.commit('showLoading')
}

const endLoading = () => {
	console.log('hideLoading==========')
	store.commit('hideLoading')
}

const tryCloseLoading = () => {
	if (needLoadingRequestCount === 0) {
		endLoading()
	}
}

const showFullScreenLoading = () => {
	if (needLoadingRequestCount === 0) {
		startLoading()
	}
	needLoadingRequestCount++
}

const tryHideFullScreenLoading = () => {
	if (needLoadingRequestCount <= 0) return
	needLoadingRequestCount--
	if (needLoadingRequestCount === 0) {
		setTimeout(() => {
			tryCloseLoading()
		}, 300)
	}
}

// 设置 POST 请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 设置语言
const borwserLang = getLanguage() || 'zh';
axios.defaults.headers['Accept-Language'] = borwserLang

// 表示跨域请求时是否需要使用凭证
axios.defaults.withCredentials = false

// 配置 CORS 跨域
axios.defaults.crossDomain = true

// 设置超时
axios.defaults.timeout = 5000

// 拦截器的说明
// 1、interceptor必须在请求前设置才有效。
// 2、直接为axios全局对象创建interceptor， 会导致全局的axios发出的请求或接收的响应都会被拦截到， 所以应该使用axios.create() 来创建单独的axios实例。

// 创建axios实例
let instance = axios.create({
	baseURL: process.env.VUE_APP_END_POINT
});

// Add a request interceptor
instance.interceptors.request.use(config => {
	if (store.state.token) {
		config.headers.Authorization = `Bearer ${store.state.token}`
	}
	if (!config.hideLoading) {
		showFullScreenLoading()
	}
	return config
}, (error) => {
	tryHideFullScreenLoading()
	return Promise.reject(error)
})

// Add a response interceptor
instance.interceptors.response.use(response => {
	if (!response.config.hideLoading) {
		tryHideFullScreenLoading()
	}
	return response.data
}, error => {
	tryHideFullScreenLoading()
	return Promise.reject(error)
})

export default instance
// export default {
// 	get: (url, config) => instance.get(url, { ...defaultConfig,
// 		...config
// 	}),
// 	put: (url, data, config) => instance.put(url, data, { ...defaultConfig,
// 		...config
// 	}),
// 	post: (url, data, config) => instance.post(url, data, { ...defaultConfig,
// 		...config
// 	}),
// 	patch: (url, data, config) => instance.patch(url, data, { ...defaultConfig,
// 		...config
// 	}),
// 	delete: (url, data, config) => instance.delete(url, { ...defaultConfig,
// 		...config
// 	})
// }
