export class EnumUtil {
    static getKey<T extends Record<string | number, string | number>>(
        enumObj: T,
        value: number | string
    ): keyof T | undefined {
        // Handle numeric enums using reverse mapping
        if (typeof value === 'number') {
            const key = enumObj[value] as unknown;
            return typeof key === 'string' ? key as keyof T : undefined;
        }

        // Handle string enums by value lookup
        return Object.entries<string | number>(enumObj)
            .find(([, val]) => val === value)?.[0] as keyof T | undefined;
    }

    static getEnumKey<T extends Record<string | number, string | number>>(
        enumObj: T,
        value: number | string
    ): keyof T {
        const key = this.getKey(enumObj, value);
        if (!key) {
            throw new Error(`Invalid enum value: ${value}`);
        }
        return key;
    }

    static getEnumEntriesWithoutReverseMapping<T extends object>(enumObj: T): [string, number][] {
        return Object.entries(enumObj)
            .filter(([key]) => isNaN(Number(key))) // Filter out reverse mappings
            .map(([key, value]) => [key, value as number]);
    }

}
