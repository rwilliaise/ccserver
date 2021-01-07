export type Item = { count: number, nbtHash?: string, name: string, damage: number };

export class Network {

	world: number[][][] = [];

	_items: Item[][] = [];
	_cache?: Item[];

	setInventory(id: number, items: Item[]) {
		this._cache = undefined;
		this._items[id] = items;
	}

	removeInventory(id: number) {
		this._items.splice(id, 1);
	}

	get items() {
		if (this._cache) {
			return this._cache;
		}
		const cache = new Map<string, number>(); // map of items and the count
		this._items.forEach(inventory => {
			inventory.forEach(item => {
				let key = `${item.nbtHash || "nil"}.${item.name}.${item.damage}`
				if (cache.has(key)) {
					cache.set(key, cache.get(key)! + item.count);
				} else {
					cache.set(key, item.count);
				}
			});
		});
		const out: Item[] = [];
		cache.forEach((value, key) => {
			let split = key.split(".");
			let nbtHash = split[0] == "nil" ? undefined : split[0];
			let name = split[1];
			let damage = parseInt(split[2]);

			out.push({ count: value, nbtHash: nbtHash, damage: damage, name: name });
		});
		this._cache = out;
		return out;
	}
}
