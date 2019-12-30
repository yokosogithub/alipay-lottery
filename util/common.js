import { u8aToHex, isHex } from '@polkadot/util'
import bs58 from 'bs58'
import { blake2AsHex } from '@polkadot/util-crypto'

export function getLanguage() {
	const language = (navigator.language || navigator.browserLanguage).toLowerCase()
	let locale
	if (language.indexOf('en') > -1) {
		locale = 'en'
	} else {
		locale = 'zh'
	}
	return locale
}

export function urlParse() {
	const obj = {};
	let keyValue = [];
	let key = '';
	let value = '';
	const url = window.location.href
	var paraString = url.substring(url.indexOf('?') + 1, url.length).split('&')
	for (var i in paraString) {
		keyValue = paraString[i].split('=')
		key = keyValue[0]
		value = keyValue[1]
		obj[key] = value
	}
	return obj
}

export function getRect(el) {
	if (el instanceof window.SVGElement) {
		let rect = el.getBoundingClientRect()
		return {
			top: rect.top,
			left: rect.left,
			width: rect.width,
			height: rect.height
		};
	} else {
		return {
			top: el.offsetTop,
			left: el.offsetLeft,
			width: el.offsetWidth,
			height: el.offsetHeight
		};
	}
}

export async function sleep(timeout) {
	await new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, timeout)
	});
}

export function checkDeviceType() {
	const ua = navigator.userAgent
	let isMobile = false
	if ((ua.match(
		/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
	))) {
		isMobile = true
	} else {
		isMobile = false
	}
	return isMobile
}

export function isWeixin() {
	var ua = navigator.userAgent.toLowerCase();
	var isWeixin = ua.indexOf('micromessenger') !== -1
	if (isWeixin) {
		return true
	} else {
		return false
	}
}

/**
 * 时间秒数格式化
 * @param timestamp 时间戳（单位：秒）
 * @returns {*} 格式化后的时分秒
 */
export function formatSeconds(timestamp, showSecond = false) {
	let result = ''
	let days, hours, minutes, seconds
	if (timestamp >= 86400) {
		days = Math.floor(timestamp / 86400)
		timestamp = timestamp % 86400
		result = days + '天';
		if (timestamp > 0) {
			result += ''
		}
	}
	if (timestamp >= 3600) {
		hours = Math.floor(timestamp / 3600)
		timestamp = timestamp % 3600
		if (hours < 10) {
			hours = '0' + hours
		}
		result += hours + '小时'
	}
	if (timestamp >= 60) {
		minutes = Math.floor(timestamp / 60)
		timestamp = timestamp % 60
		if (minutes < 10) {
			minutes = '0' + minutes
		}
		result += minutes + '分'
	}
	if (showSecond) {
		seconds = Math.floor(timestamp)
		if (seconds < 10) {
			seconds = '0' + seconds
		}
		result += seconds + '秒'
	}
	return result
}

export function getRandomNum(m, n) {
	return Math.floor(Math.random() * (m - n) + n)
}

export function getRandomWord(randomFlag, min, max) {
	var str = '';
	var range = min
	var pos
	var arr = ['1', '2', '3', '4', '5', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
		'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
	];

	// 随机产生
	if (randomFlag) {
		range = Math.round(Math.random() * (max - min)) + min
	}
	for (var i = 0; i < range; i++) {
		pos = Math.round(Math.random() * (arr.length - 1))
		str += arr[pos];
	}
	return str
}

export function formatNumber(num) {
	return parseInt(num * 10 ** 15)
}

export function formatHexNumber(hexNum) {
	if (isHex(hexNum)) {
		return hexNum.toString() / 10 ** 15
	} else if (typeof hexNum === 'number') {
		return hexNum / 10 ** 15
	}
	return 0
}

export function getObjectURL(file) {
	let url = null
	if (window.createObjectURL !== undefined) {
		// basic
		url = window.createObjectURL(file)
	} else if (window.URL !== undefined) {
		// mozilla(firefox)
		url = window.URL.createObjectURL(file)
	} else if (window.webkitURL !== undefined) {
		// webkit or chrome
		url = window.webkitURL.createObjectURL(file)
	}
	return url
}

export function didToHex(did) {
	const bytes = bs58.decode(did.substring(8))
	return blake2AsHex(bytes, 256)
}

export function hexToDid(hex) {
	let did
	if (isHex(hex)) {
		const bytes = Buffer.from(hex.slice(2), 'hex')
		const address = bs58.encode(bytes)
		did = `did:pra:${address}`
	} else {
		const hexStr = u8aToHex(hex)
		const bytes = Buffer.from(hexStr.slice(2), 'hex')
		const address = bs58.encode(bytes)
		did = `did:pra:${address}`
	}
	return did
}

export function clipAddress(address, start, end) {
	let result = `${address.slice(0, start)}...${address.slice(end)}`
	return result
}
