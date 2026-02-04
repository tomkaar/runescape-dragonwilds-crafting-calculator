export interface SourceItem {
  page_name: string;
  item_description?: string;
  item_name: string;
  item_type: string;
  item_stacklimit?: number;
  json: SourceItemJson;
  item_weight: number;
  page_name_sub: string;
  item_repair?: string;
}

export interface SourceItemJson {
  type: string;
  description?: string;
  image: string;
  name: string;
  weight: string;
  stacklimit?: string;
  image_raw: string;
  hydration?: string;
  sustenance?: string;
  repaircost?: string;
  perk?: SourcePerk;
  duration?: string;
}

export interface SourcePerk {
  name: string;
  effect: string;
}
