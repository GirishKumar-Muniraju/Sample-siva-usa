export class Utility {
    /**
     * Extract Key Values Map from KeyValue string array
     */
    static toKeyValuesObject(keyValueStrArr: string[]) {
        const keyValues: Record<string, any> = {};
        (keyValueStrArr || []).forEach(keyValueStr => {
            const split = keyValueStr.split(':');
            keyValues[split[0].trim()] = split[1].trim();
        });
        return keyValues;
    }

    /**
     * Extract Key Values String Array from KeyValues Map
     */
    static toKeyValuesStrArray(keyValues: Record<string, any>) {
        return Object.keys(keyValues).map(key => `${key}:${keyValues[key]}`);
    }

    /**
     * Pads Request number with leading zeros and adds prefix 'REQ'
     */
    static formReqNumber(reqId: number) {
        return `REQ${reqId.toString().padStart(8, '0')}`;
    }

    static parseBoolean(value: string): boolean {
        return value === 'true' || value === '1';
    }

    static extractSlid(username: string): string {
        if (!username || username.length === 0) { return null; }

        const splits = username.split('_');
        if (splits != null && splits.length > 1) {
            return splits[1];
        } else {
            return username;
        }
    }
}
