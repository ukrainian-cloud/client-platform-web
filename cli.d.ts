export type ArgParsers<T> = {
	[x in keyof T]: (next: string) => T[x];
};

export type ArgMap<T> = Record<string, keyof T>;

export type CheckFunc<T> = (value: T) => void;
