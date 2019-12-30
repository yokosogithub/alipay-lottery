import * as Mutations from './constants'

export const mutations = {
    [Mutations.SET_WALLET_INFO]: (state, walletInfo) => {
        state.walletInfo = walletInfo
    },
    [Mutations.SET_TEAM_INFO]: (state, teamInfo) => {
        state.teamInfo = teamInfo
    },
    showLoading: (state) => {
        state.showLoading = true
    },
    hideLoading: (state) => {
        state.showLoading = false
    }
}
