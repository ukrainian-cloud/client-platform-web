import { LocalDB, type LocalDBEnum, ColorScheme, getUtility } from '@ukrainian-cloud/utils';

export class ClolorSchemeWebImpl extends ColorScheme {
	async getDefault(): Promise<LocalDBEnum<'Theme'>> {
		const localDB = await getUtility(LocalDB);
		const { Theme } = localDB.enums;
		return matchMedia('prefers-color-scheme: light').matches ? Theme.light : Theme.dark;
	}
}
