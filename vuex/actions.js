import { hexToString } from '@polkadot/util'
import * as Actions from './constants'
import { formatHexNumber } from '../util/common'
import vm from '../main'

export const actions = {
	[Actions.SET_WALLET_INFO]: async({ commit }, walletInfo) => {
		// set client name
		vm.$socket.emit('setName', {
			name: walletInfo.did,
			address: walletInfo.address
		})
		commit(Actions.SET_WALLET_INFO, walletInfo)
	},
	[Actions.SET_TEAM_INFO]: async({ commit }, teamInfo) => {
		commit(Actions.SET_TEAM_INFO, teamInfo)
	},
	/**
	 * @@@
	 * all socket relevant state
	 */
	[Actions.SOCKET_CONNECT]: ({ state: { walletInfo }}) => {
		console.log('connect------')
		if (walletInfo.did) {
			vm.$socket.emit('setName', {
				name: walletInfo.did,
				address: walletInfo.address
			})
		}
	},
	[Actions.SOCKET_DISCONNECT]: () => {
		console.log('disconnect------')
	},
	[Actions.SOCKET_RECONNECT]: () => {
		console.log('reconnect------')
	},
	[Actions.SOCKET_BALANCE_CHANGE]: ({ commit, state }, msg) => {
		const { balance } = JSON.parse(msg)
		const walletInfo = {
			...state.walletInfo,
			free_balance: balance
		}
		commit(Actions.SET_WALLET_INFO, walletInfo)
	},
	[Actions.SOCKET_FAILED]: ({ commit }, msg) => {
		const { msg: errorMsg } = JSON.parse(msg)
		vm.$toast(errorMsg)
		commit('hideLoading')
	},
	[Actions.SOCKET_TRANSFERED]: ({ commit }) => {
		commit('hideLoading')
	},
	[Actions.SOCKET_LOCKED]: ({ state, commit }, msg) => {
		const [, lockedFunds, lockedTime, lockedPeriod, rewardsRatio, maxQuota] = JSON.parse(msg)
		const lockedRecords = {
			locked_funds: formatHexNumber(lockedFunds),
			locked_time: lockedTime,
			locked_period: lockedPeriod,
			rewards_ratio: rewardsRatio,
			max_quota: formatHexNumber(maxQuota)
		}
		const walletInfo = {
			...state.walletInfo,
			locked_records: lockedRecords
		}
		commit(Actions.SET_WALLET_INFO, walletInfo)
		commit('hideLoading')
	},
	[Actions.SOCKET_UNLOCKED]: ({ state: { walletInfo }, commit }, msg) => {
		const [, amount, unlockedTime] = JSON.parse(msg)
		const unlockedRecords = walletInfo.unlocked_records
		const unlockedFunds = formatHexNumber(amount)
		let newUnlockedFunds = (unlockedRecords.unlocked_funds || 0) + unlockedFunds

		// update locked data
		const lockedRecords = walletInfo.locked_records
		const lockedFunds = lockedRecords.locked_funds - unlockedFunds
		let maxQuota = lockedFunds * 10
		let rewardsRatio
		if (maxQuota >= walletInfo.subordinate_count) {
			rewardsRatio = 20
		} else {
			rewardsRatio = 100 * (1 - maxQuota / walletInfo.subordinate_count)
		}

		const newWalletInfo = {
			...walletInfo,
			locked_records: {
				...lockedRecords,
				locked_funds: lockedFunds,
				max_quota: maxQuota,
				rewards_ratio: rewardsRatio
			},
			unlocked_records: {
				unlocked_funds: newUnlockedFunds,
				unlocked_time: unlockedTime
			}
		}
		commit(Actions.SET_WALLET_INFO, newWalletInfo)
		commit('hideLoading')
	},
	[Actions.SOCKET_ADDRESS_ADDED]: ({ state: { walletInfo }, commit }, msg) => {
		let [, addressType, address] = JSON.parse(msg)
		const externalAddress = walletInfo.external_address

		addressType = hexToString(addressType)
		address = hexToString(address)
		const newWalletInfo = {
			...walletInfo,
			external_address: {
				...externalAddress,
				[addressType]: address
			}
		}
		commit(Actions.SET_WALLET_INFO, newWalletInfo)
		commit('hideLoading')
		vm.$router.push(('/'))
	},
	[Actions.SOCKET_GROUPNAME_SET]: ({ commit }) => {
		commit('hideLoading')
	},
	[Actions.SOCKET_UPDATED]: ({ commit }) => {
		commit('hideLoading')
	},
	[Actions.SOCKET_CREATED]: ({ state, commit }) => {
		const subordinateCount = state.walletInfo.subordinate_count + 1
		const walletInfo = {
			...state.walletInfo,
			subordinate_count: subordinateCount
		}
		commit(Actions.SET_WALLET_INFO, walletInfo)
	},
};
