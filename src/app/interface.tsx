export interface Users {
    uid: number;
    username: string;
    password: string;
    email: string;
    name: string;
    inventory: Inventory[];
    user_resources: User_resources[];
    suited: Suited[];
}

export interface User_resources {
    id: number;
    uid: number;
    chic_coins: number;
    glamour_gems: number;
    glamour_dust: number;
    fashion_tokens: number;
    shimmering_essence: number;
    glimmering_essence: number;
    pity: number;
    is_rate: boolean;
}

export interface Suited {
    id: number;
    uid: number;
    a: string;
    b: string;
    c: string;
}

export interface GachaItem {
    id: number;
    rarity: string;
    item_name: string;
    part_outfit: string;
    rate_up: boolean;
    islimited: boolean;
    layer: string;
    stat: Stat;
    power: number;
}

interface Stat {
    attack?: number;
    defense?: number;
    magic?: number;
    speed?: number;
}

export interface Inventory {
    id: number;
    uid: number;
    rarity: string;
    item_name: string;
    part_outfit: string;
    layer: string;
    created_at: string;
    stat: Stat;
    power: number;
}

export interface HistoryGachaA {
    uid: number;
    rarity: string;
    item_name: string;
    part_outfit: string;
    gacha_type: string;
    gacha_time: string;
}

export interface Products {
    id: number;
    name: string;
    price: number;
    glamour_gems: number;
}

export interface TokenItems {
    id: number;
    name: string;
    description: string;
    price: number;
    limit: number;
}

export interface DustItems {
    id: number;
    name: string;
    description: string;
    price: number;
    limit: number;
}