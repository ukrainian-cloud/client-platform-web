import { LocalDB } from '@ukrainian-cloud/utils';

const kvStoreName = 'kv';

export class LocalDBWebImpl extends LocalDB {
	private db: IDBDatabase | undefined;

	private runTransaction<T>(readonly: boolean, runner: (store: IDBObjectStore) => IDBRequest<T> | Promise<IDBRequest<T>>) {
		return new Promise<T>(async (resolve, reject) => {
			const tx = this.db!.transaction(kvStoreName, readonly ? 'readonly' : 'readwrite');
			const store = tx.objectStore(kvStoreName);
			const request = await runner(store);
			request.onerror = () => {
				request.onsuccess = null;
				request.onerror = null;
				reject(request.error);
			};
			request.onsuccess = () => {
				request.onsuccess = null;
				request.onerror = null;
				resolve(request.result);
			};
		});
	}

	async init() {
		await new Promise<void>((resolve, reject) => {
			const dbName = 'main';
			const openRequest = indexedDB.open(dbName, 1);
			openRequest.onupgradeneeded = function() {
				const db = openRequest.result;
				if (!db.objectStoreNames.contains(kvStoreName)) {
					db.createObjectStore(kvStoreName, { keyPath: 'key' });
				}
			};
			openRequest.onerror = () => {
				openRequest.onupgradeneeded = null;
				openRequest.onerror = null;
				openRequest.onsuccess = null;
				reject(openRequest.error);
			};
			openRequest.onsuccess = () => {
				openRequest.onupgradeneeded = null;
				openRequest.onerror = null;
				openRequest.onsuccess = null;
				this.db = openRequest.result;
				resolve();
			};
		});
	}

	async get(name: string) {
		return await this.runTransaction(true, (store) => store.get(name));
	}

	async set(name: string, value: unknown) {
		const serializableValue = JSON.parse(JSON.stringify(value));
		await this.runTransaction(false, (store) => store.put(serializableValue, name));
		this.emitChange(name, serializableValue);
	}

	async delete(name: string) {
		await this.runTransaction(false, (store) => store.delete(name));
		this.emitChange(name, undefined);
	}
}
