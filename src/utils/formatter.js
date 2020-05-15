import tickers from '../data/tickers.json';
import tokens from '../data/tokens.json';

class Formatter {
	static formatAddress(address) {
		if (!address) {
			return '';
		}
		const ellipsizedAddress = `${address.substr(0, 8)}…${address.substr(36)}`;
		return ellipsizedAddress;
	}

	static formatTicker(id) {
		const ticker = tickers[id];
		return ticker;
	}

	static formatAsset(id) {
		const token = tokens[id];
		return token;
	}

	static formatProtocol(protocolId) {
		const protocolMap = {
			'aave': 'Aave',
			'balancer': 'Balancer',
			'compound': 'Compound',
			'curve': 'Curve',
			'dydx': 'dYdX',
			'fulcrum': 'Fulcrum',
			'hydro': 'DDEX',
			'maker': 'Maker DSR',
			'uniswap': 'Uniswap',
			'tokensets': 'TokenSets',
			'melon': 'Melon',
		};
		const protocol = protocolMap[protocolId];
		return protocol;
	}

	static formatAmount(amountString) {
		const amount = new Number(amountString);
		const options = {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		};
		return amount.toLocaleString(undefined, options);
	}

	static formatMoney(priceString) {
		const amount = new Number(priceString);
		const options = {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
			style: 'currency',
			currency: 'USD',
		};
		return amount.toLocaleString(undefined, options);
	}

	static formatRate(rateString) {
		if (!rateString) {
			return '…';
		}
		const rate = new Number(rateString);
		const options = {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
			style: 'percent',
		};
		return rate.toLocaleString(undefined, options);
	}

	static formatUniswapPool(poolId) {
		const assets = poolId.split('_');
		const tokenAsset = tickers[assets[0]];
		const etherAsset = tickers[assets[1]];
		return `(${tokenAsset} + ${etherAsset})`;
	}

	static formatSet(setId) {
		const roboSets = {
			'btcdai': 'BTCHIVOL',
			'btceth2575': 'BTCETH2575',
			'btceth5050': 'BTCETH5050',
			'btceth7525': 'BTCETH7525',
			'btcminvol': 'BTCMINVOL',
			'eth12emaco': 'ETH12EMACO',
			'eth20smaco': 'ETH20SMACO',
			'eth26emaco': 'ETH26EMACO',
			'eth50smaco': 'ETH50SMACO',
			'ethbtc26emaco': 'ETHBTCEMACO',
			'ethbtcrsi7030': 'ETHBTCRSI7030',
			'ethdai': 'ETHHIVOL',
			'ethemaapy': 'ETHEMAAPY',
			'ethmacoapy': 'ETHMACOAPY',
			'ethminvol': 'ETHMINVOL',
			'ethrsi6040': 'ETHRSI6040',
			'ethrsiapy': 'ETHRSIAPY',
			'ieth20smaco': 'iETH20SMACO',
			'ieth50smaco': 'iETH50SMACO',
			'stbtcdai': 'BTCLOVOL',
			'stethdai': 'ETHLOVOL',
		};
		const socialSets = {
			'bbb': 'BBB',
			'bbe': 'BBE',
			'btcmoon': 'BTCMOON',
			'btcmoonx': 'BTCMOONX',
			'btcusdcrsi': 'BTCUSDCRSI',
			'btcusdcta': 'BTCUSDCTA',
			'eth10k': 'ETH10K',
			'ethmoonx': 'ETHMOONX',
			'ethusdadl4': 'ETHUSDADL4',
			'ethusdcta': 'ETHUSDCTA',
			'evol': 'EVOL',
			'flexbtc': 'FLEXBTC',
			'flexeth': 'FLEXETH',
			'flexethbtc': 'FLEXETHBTC',
			'greed': 'GREED',
			'ichiema': 'ICHIEMA',
			'intbtc': 'INTBTC',
			'inteth': 'INTETH',
			'long': 'LONG',
			'ric': 'RIC',
			'tls': 'TLS',
		};
		const sets = {...roboSets, ...socialSets};
		return sets[setId];
	}

	static formatSetName(setId) {
		const roboSets = {
			'btcdai': 'BTC Range Bound High Volatility',
			'btceth2575': 'ETH BTC 75%/25% Weight',
			'btceth5050': 'BTC ETH Equal Weight',
			'btceth7525': 'BTC ETH 75%/25% Weight',
			'btcminvol': 'BTC Range Bound Min Volatility',
			'btcusdcta': 'BTC TA',
			'eth12emaco': 'ETH 12 Day EMA Crossover',
			'eth20smaco': 'ETH 20 Day Moving Average Crossover',
			'eth26emaco': 'ETH 26 Day EMA Crossover',
			'eth50smaco': 'ETH 50 Day Moving Average Crossover',
			'ethbtc26emaco': 'ETH/BTC EMA Ratio Trading',
			'ethbtcrsi7030': 'ETH/BTC RSI Ratio Trading',
			'ethdai': 'ETH Range Bound High Volatility',
			'ethemaapy': 'ETH 26 EMA Crossover Yield Set',
			'ethmacoapy': 'ETH 20 Day MA Crossover Yield Set',
			'ethminvol': 'ETH Range Bound Min Volatility',
			'ethrsi6040': 'ETH RSI 60/40 Crossover',
			'ethrsiapy': 'ETH RSI 60/40 Yield Set',
			'ethusdcta': 'ETH TA',
			'ieth20smaco': 'Inverse ETH 20 Day MA Crossover',
			'ieth50smaco': 'Inverse ETH 50 Day MA Crossover',
			'stbtcdai': 'BTC Range Bound Low Volatility',
			'stethdai': 'ETH Range Bound Low Volatility',
		};
		const socialSets = {
			'bbb': 'BullBearBitcoin Set',
			'bbe': 'BullBearEthereum Set',
			'btcmoon': 'BTC Moonshot Set',
			'btcmoonx': 'BTC Moonshot X Set',
			'btcusdcrsi': 'WBTC USDC RSI Set',
			'eth10k': 'ETH Maximalist Set',
			'ethmoonx': 'ETH Moonshot X Set',
			'ethusdadl4': 'ETHUSD ADL 4H Set',
			'evol': 'ETH Volatility Adjusted Set',
			'flexbtc': 'FlexBTC Set',
			'flexeth': 'FlexETH Set',
			'flexethbtc': 'FlexETH/BTC Set',
			'greed': 'Fear & Greed Sentiment Set',
			'ichiema': '12H Ichimoku HA EMA Breakout Set',
			'intbtc': 'The Intelligent BTC Trading Set',
			'inteth': 'The Intelligent ETH Trading Set',
			'long': 'High Conviction / Fundamentals Set',
			'ric': 'Target 2022 Set',
			'tls': 'TrustlessState Set',
		};
		const sets = {...roboSets, ...socialSets};
		return sets[setId];
	}

	static formatCurvePool(poolId) {
		const poolMap = {
			'cdai-cusdc': 'Compounded',
			'cdai-cusdc-usdt': 'Tethered',
			'ydai_2-yusdc_2-yusdt_2-ytusd_2': 'Yield (TUSD)',
			'ydai_3-yusdc_3-yusdt_3-ybusd_3': 'Yield (BUSD)',
		};
		return poolMap[poolId];
	}

	static formatPool(assetId, poolId) {
		if (assetId == 'zrx') {
			const zrxPoolMap = {
				'0': 'Unstaked',
				'2': 'Rigo ZRX Staker',
				'6': 'Zaidan\'s War Chest',
				'12': 'DUST | pool',
				'16': 'Veridex',
				'20': 'Prycto',
			};
			const defaultName = `pool ${poolId}`;
			const poolName = zrxPoolMap[poolId] || defaultName;
			return poolName;
		}
	}
}

export default Formatter;
