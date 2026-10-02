export interface SourceStoreline {
	page_name: string;
	page_name_sub: string;
	sold_item: string;
	sold_item_json: string;
	json: SourceStorelineJson;
}

interface SourceStorelineJson {
	Mode: "buy" | "sell";
	"Sold by": string;
	Currency: string;
	Cost: number;
}
