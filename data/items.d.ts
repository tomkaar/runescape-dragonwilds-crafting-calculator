// Type definitions for infobox_item JSON
interface InfoboxItemJson {
  name?: string;
  image?: string;
  release?: string;
  update?: string;
  removal?: string;
  aka?: string;
  members?: boolean | string;
  quest?: string;
  tradeable?: boolean | string;
  equipable?: boolean | string;
  stackable?: boolean | string;
  noteable?: boolean | string;
  options?: string[];
  destroy?: string;
  examine?: string;
  value?: number | string;
  weight?: number | string;
  exchange?: string;
  id?: number | string;
  [key: string]: unknown;
}

interface InfoboxItem {
  page_name?: string;
  page_name_sub?: string;
  item_name?: string;
  item_type?: string;
  item_repair?: string;
  item_weight?: string;
  item_stacklimit?: string;
  item_description?: string;
  perk_name?: string;
  json?: InfoboxItemJson;
}
