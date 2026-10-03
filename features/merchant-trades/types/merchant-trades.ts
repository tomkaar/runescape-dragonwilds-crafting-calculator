export type MerchantTradeItem = {
	id: string;
	name: string;
	image: string | null;
	/* Amount of currency per item */
	cost: number;
};

export type MerchantTradeGroup = {
	merchant: string;
	items: MerchantTradeItem[];
};

export type MerchantTrades = {
	/* Items the player can buy with the currency */
	buy: MerchantTradeGroup[];
	/* Items the player can sell for the currency */
	sell: MerchantTradeGroup[];
};
