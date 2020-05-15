<template>
	<router-link
		id="card"
		:to="`/wallet/${walletAddress}/investment/${protocolId}/${investmentId}`"
	>
		<Card
			:wallet-id="walletId"
			:amount="amount"
			:ticker="ticker"
			:title="title"
			:price="price"
		/>
		<SetIcon
			v-if="protocolId == 'tokensets'"
			id="logo"
			:set-id="investmentId"
		/>
		<UniswapIcon
			v-if="protocolId == 'uniswap'"
			id="logo"
			:pool-id="investmentId"
		/>
		<ProtocolIcon
			v-if="protocolId == 'melon'"
			id="logo"
			:protocol-id="protocolId"
		/>
	</router-link>
</template>

<script>
import Card from './Card.vue';
import SetIcon from '../icon/SetIcon.vue';
import UniswapIcon from '../icon/UniswapIcon.vue';
import ProtocolIcon from '../icon/ProtocolIcon.vue';

import Formatter from '../../utils/formatter.js';
import Storage from '../../utils/storage.js';

export default {
	components: {
		Card,
		SetIcon,
		UniswapIcon,
		ProtocolIcon,
	},
	props: {
		walletId: {
			type: Number,
			default: 0,
		},
		protocolId: {
			type: String,
			default: '',
		},
		investmentId: {
			type: String,
			default: '',
		},
		amount: {
			type: String,
			default: '0',
		},
		price: {
			type: Number,
			default: 0,
		},
	},
	computed: {
		ticker() {
			if (this.protocolId == 'uniswap') {
				return Formatter.formatUniswapPool(this.investmentId);
			}
			if (this.protocolId == 'tokensets') {
				return Formatter.formatSet(this.investmentId);
			}
			if (this.protocolId == 'curve') {
				return Formatter.formatCurvePool(this.investmentId);
			}
			if (this.protocolId == 'balancer') {
				return 'BPT';
			}
			return this.investmentId;
		},
		title() {
			const title = Formatter.formatProtocol(this.protocolId);
			return title;
		},
		walletAddress() {
			const walletList = Storage.getWalletList();
			return walletList[this.walletId].address;
		},
	},
};
</script>

<style scoped>
#card {
	display: flex;
	justify-content: center;
	align-items: center;
}

#logo {
	width: 64px;
	height: 64px;
	position: absolute;
	pointer-events: none;
	opacity: 0.1;
}
</style>
