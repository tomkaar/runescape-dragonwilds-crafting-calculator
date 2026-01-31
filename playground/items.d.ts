export type ItemsRoot = RawItem[];

export interface RawItem {
  page_name: string;
  item_description?: string;
  item_name: string;
  item_type: string;
  item_stacklimit?: number;
  json: Json;
  item_weight: number;
  page_name_sub: string;
  item_repair?: string;
}

export interface Json {
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
  perk?: Perk;
  duration?: string;
}

export interface Perk {
  name: string;
  effect: string;
}
