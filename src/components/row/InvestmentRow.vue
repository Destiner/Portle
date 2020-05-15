<template>
	<router-link :to="`/wallet/${walletAddress}/investment/${protocolId}/${investmentId}`">
		<Row
			:wallet-id="walletId"
			:amount="amount"
			:ticker="ticker"
			:title="title"
			:subtitle="subtitle"
			:price="price"
		/>
	</router-link>
</template>

<script>
import Row from './Row.vue';

import Formatter from '../../utils/formatter.js';
import Storage from '../../utils/storage.js';

export default {
	components: {
		Row,
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
		title() {
			const title = Formatter.formatProtocol(this.protocolId);
			return title;
		},
		subtitle() {
			const priceString = Formatter.formatMoney(this.price);
			return `${priceString}/`;
		},
		ticker() {
			if (this.protocolId == 'uniswap') {
				return Formatter.formatUniswapPool(this.investmentId);
			}
			if (this.protocolId == 'tokensets') {
				return Formatter.formatSet(this.investmentId);
			}
			if (this.protocolId == 'melon') {
				return 'shares';
			}
			if (this.protocolId == 'curve') {
				return Formatter.formatCurvePool(this.investmentId);
			}
			if (this.protocolId == 'balancer') {
				return 'BPT';
			}
			return this.investmentId;
		},
		walletAddress() {
			const walletList = Storage.getWalletList();
			return walletList[this.walletId].address;
		},
	},
};
</script>
