<template>
	<div id="view">
		<WalletList
			id="wallet-section"
			:wallets="wallets"
			:selected-wallet="walletId"
			:prices="prices"
			:components="components"
		/>
		<div id="investment-section">
			<div
				v-if="investment && investment.protocolId == 'tokensets'"
				id="investment-icon"
			>
				<SetIcon :set-id="investment.id" />
			</div>
			<div
				v-if="investment && investment.protocolId == 'uniswap'"
				id="investment-icon"
			>
				<UniswapIcon :pool-id="investment.id" />
			</div>
			<div
				v-if="investment && investment.protocolId == 'melon'"
				id="investment-icon"
			>
				<ProtocolIcon :protocol-id="investment.protocolId" />
			</div>
			<div
				v-if="investment"
				id="investment-view"
			>
				<div id="asset">
					<div id="amount">
						{{ formatAmount(investment.amount) }} {{ formatInvestmentId(investment) }}
					</div>
					<div id="investment-details">
						<div>
							{{ formatInvestmentName(investment) }}
						</div>
					</div>
					<div id="price-details">
						<div>
							{{ formatProtocol(investment.protocolId) }}
						</div>
						<div id="price">
							{{ formatMoney(investment.price) }}/
						</div>
						<div>
							{{ formatMoney(investment.value) }}
						</div>
					</div>
				</div>
				<div id="components">
					<div
						v-for="component in investmentComponents"
						:key="component.assetId"
						class="component"
					>
						<div class="component-icon">
							<AssetIcon :asset-id="component.assetId" />
						</div>
						<div class="component-details">
							<div>
								<div class="component-amount">
									{{ formatAmount(component.amount) }} {{ formatTicker(component.assetId) }}
								</div>
								<div class="component-name">
									{{ formatAsset(component.assetId) }}
								</div>
							</div>
							<div class="component-value">
								{{ formatMoney(component.value) }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';

import Converter from '../../utils/converter.js';
import Formatter from '../../utils/formatter.js';
import Loader from '../../utils/loader.js';
import Storage from '../../utils/storage.js';

import SetIcon from '../../components/icon/SetIcon.vue';
import UniswapIcon from '../../components/icon/UniswapIcon.vue';
import ProtocolIcon from '../../components/icon/ProtocolIcon.vue';
import AssetIcon from '../../components/icon/AssetIcon.vue';
import WalletList from '../../components/group/WalletList.vue';

export default {
	components: {
		SetIcon,
		UniswapIcon,
		ProtocolIcon,
		AssetIcon,
		WalletList,
	},
	data() {
		return {
			address: '',
			protocolId: '',
			investmentId: '',
		};
	},
	computed: {
		investment() {
			if (this.balance == 0) {
				return;
			}
			const id = this.investmentId;
			const protocolId = this.protocolId;
			const amount = Converter.toAmount(this.balance, 'eth');
			const valueNumber = this.investmentComponents
				.reduce((sum, component) => sum.plus(component.value), new BigNumber(0));
			const value = valueNumber.toString();
			const price = valueNumber.div(amount).toString();
			const investment = {
				id,
				protocolId,
				amount,
				price,
				value,
			};
			return investment;
		},
		investmentComponents() {
			if (!this.components) {
				return [];
			}
			if (!this.components[this.protocolId]) {
				return [];
			}
			const components = this.components[this.protocolId][this.investmentId];
			const investmentComponents = [];
			const investmentAmount = Converter.toAmount(this.balance, 'eth');
			for (const component of components) {
				const { amount, assetId } = component;
				const assetPrice = this.prices[assetId];
				if (!assetPrice) {
					return [];
				}
				const assetPriceNumber = new BigNumber(assetPrice);
				const amountNumber = new BigNumber(amount);
				const componentAmount = amountNumber.times(investmentAmount);
				const value = amountNumber.times(investmentAmount).times(assetPriceNumber).toString();
				const investmentComponent = {
					amount: componentAmount,
					assetId,
					value,
				};
				investmentComponents.push(investmentComponent);
			}
			investmentComponents.sort((a, b) => {
				const aValue = new BigNumber(a.value);
				const bValue = new BigNumber(b.value);
				return aValue.lt(bValue)
					? 1
					: aValue.gt(bValue)
						? -1
						: 0;
			});
			return investmentComponents;
		},
		balance() {
			const wallet = this.wallets[this.walletId];
			if (!wallet || !wallet.investments) {
				return 0;
			}
			const balance = wallet.investments[this.protocolId][this.investmentId];
			if (!balance) {
				return 0;
			}
			return balance;
		},
		walletId() {
			return this.wallets.findIndex(wallet => wallet.address == this.address);
		},
		...mapState([
			'wallets',
			'prices',
			'rates',
			'components',
		]),
	},
	async mounted() {
		const walletList = Storage.getWalletList();
		if (walletList.length == 0) {
			this.$router.push('/login');
			return;
		}
		this.address = this.$route.params.wallet;
		this.protocolId = this.$route.params.protocolId;
		this.investmentId = this.$route.params.investmentId;
		this._load(walletList);
	},
	methods: {
		getUnderlyingAmount(component) {
			const componentAmount = component.amount;
			const componentAmountNumber = new BigNumber(componentAmount);
			const investmentAmount = this.investment.amount;
			return componentAmountNumber.times(investmentAmount);
		},
		formatAsset(assetId) {
			return Formatter.formatAsset(assetId);
		},
		formatTicker(assetId) {
			return Formatter.formatTicker(assetId);
		},
		formatInvestmentId(investment) {
			if (investment.protocolId == 'uniswap') {
				return Formatter.formatUniswapPool(investment.id);
			}
			if (investment.protocolId == 'tokensets') {
				return Formatter.formatSet(investment.id);
			}
			if (investment.protocolId == 'melon') {
				return 'shares';
			}
			if (investment.protocolId == 'curve') {
				return 'tokens';
			}
			if (investment.protocolId == 'balancer') {
				return 'BPT';
			}
			return investment.id;
		},
		formatInvestmentName(investment) {
			if (investment.protocolId == 'uniswap') {
				const assets = this.investmentId.split('_');
				return `${this.formatTicker(assets[0])}-${this.formatTicker(assets[1])} Uniswap pool`;
			}
			if (investment.protocolId == 'tokensets') {
				return Formatter.formatSetName(investment.id);
			}
			if (investment.protocolId == 'melon') {
				return 'Melon fund';
			}
			if (investment.protocolId == 'curve') {
				return Formatter.formatCurvePool(investment.id);
			}
			if (investment.protocolId == 'balancer') {
				return 'Balancer pool';
			}
			return investment.id;
		},
		formatProtocol(protocolId) {
			return Formatter.formatProtocol(protocolId);
		},
		formatAmount(amountString) {
			return Formatter.formatAmount(amountString);
		},
		formatMoney(priceString) {
			return Formatter.formatMoney(priceString);
		},
		async _load(walletList) {
			const addresses = walletList.map(wallet => wallet.address);
			const savedWallets = this.$store.state.wallets;
			if (addresses.length == savedWallets.length) {
				return;
			}
			const requiredWallets = [];
			for (const address of addresses) {
				const wallet = savedWallets.find(wallet => wallet.address == address);
				if (wallet) {
					requiredWallets.push(wallet);
				} else {
					requiredWallets.push({ address });
				}
			}
			this.$store.commit('setWallets', requiredWallets);
			const {wallets, prices, rates, components} = await Loader.loadWallets(addresses);
			this.$store.commit('setWallets', wallets);
			this.$store.commit('setPrices', prices);
			this.$store.commit('setRates', rates);
			this.$store.commit('setComponents', components);
		},
	},
};
</script>

<style scoped>
#view {
	display: flex;
}

#wallet-section {
	flex: 1;
	padding: 1.5em 1em;
}

#investment-section {
	flex: 3;
	padding: 4.75em 3.5em 0 3.5em;
	display: flex;
	justify-content: center;
}

#investment-icon {
	display: flex;
	position: absolute;
	width: 4em;
	height: 4em;
	margin-top: -2em;
	align-items: center;
	justify-content: center;
	background: var(--cover-color);
	border-radius: 2em;
}

#investment-icon > img {
	width: 3em;
	height: 3em;
}

#investment-view {
	box-sizing: border-box;
	width: 40em;
	height: 14.75em;
}

#asset {
	padding: 2.75em 3em 0 3em;
	box-sizing: border-box;
	height: 14.75em;
	background: var(--brand-color);
	border-top-left-radius: 8px;
	border-top-right-radius: 8px;
	color: var(--inverted-secondary-text-color);
}

#amount {
	font-size: 4em;
	text-align: center;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	color: var(--inverted-primary-text-color);
}

#investment-details,
#price-details {
	display: flex;
	font-size: 1.5em;
}

#investment-details {
	margin-top: 1.25rem;
	justify-content: center;
}

#price-details {
	margin-top: 0.875rem;
	justify-content: space-between;
}

#components {
	border: 1px solid var(--brand-color);
	border-bottom-left-radius: 8px;
	border-bottom-right-radius: 8px;
}

.component {
	display: flex;
	box-sizing: border-box;
	height: 4em;
	padding: 0.75em 1em;
	border-top: 1px solid var(--outline-color);
}

.component-icon {
	display: flex;
	height: 2.5em;
	width: 2.5em;
	justify-content: center;
	align-items: center;
	background: var(--cover-color);
	border-radius: 1.25em;
}

.component-icon > img {
	height: 1.5em;
	width: 1.5em;
	filter: grayscale(100%);
}

.component-details {
	display: flex;
	flex-grow: 1;
	padding-left: 1em;
	justify-content: space-between;
	align-items: flex-end;
}

.component-amount {
	font-size: 1.125em;
}

.component-name,
.component-value {
	font-size: 0.875em;
	color: var(--secondary-text-color);
}

@media all and (max-width: 1024px) {
	#view {
		display: block;
	}

	#wallet-section {
		padding: 0;
	}
}

@media all and (max-width: 767px) {
	#asset {
		height: initial;
		padding: 3em 1.5em 1em 1.5em;
	}

	#investment-section {
		padding: 4em 0 1em 0;
	}

	#investment-view {
		height: initial;
		width: 90%;
	}

	#investment-details > div {
		font-size: 1.125rem;
		text-align: center;
	}

	#price-details > div {
		font-size: 1.125rem;
	}

	#amount {
		font-size: 1.5em;
	}

	#price {
		display: none;
	}
}
</style>
