<template>
	<router-link :to="`/wallet/${walletAddress}/stake/${assetId}/${poolId}`">
		<Row
			:wallet-id="walletId"
			:amount="amount"
			:ticker="ticker"
			:title="title"
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
		assetId: {
			type: String,
			default: '',
		},
		poolId: {
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
			return Formatter.formatPool(this.assetId, this.poolId);
		},
		ticker() {
			return Formatter.formatTicker(this.assetId);
		},
		walletAddress() {
			const walletList = Storage.getWalletList();
			return walletList[this.walletId].address;
		},
	},
};
</script>
