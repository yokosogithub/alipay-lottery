import createPersistedState from 'vuex-persistedstate';
import { mutations } from './mutations';
import { actions } from './actions';

const state = {
	walletInfo: {
		external_address: {},
		locked_records: {},
		unlocked_records: {}
	},
	teamInfo: {},
	showLoading: true,
	locale: 'zh'
};

/* eslint-disable */
export default new Vuex.Store({
	state,
	mutations,
	actions,
	plugins: [createPersistedState({ storage: window.sessionStorage })]
})
