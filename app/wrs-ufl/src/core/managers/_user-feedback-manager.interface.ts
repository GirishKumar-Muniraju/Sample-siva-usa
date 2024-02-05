import { INeoReleaseInfo } from '../interfaces/neo-release-info.interface';

export interface NeoReleaseInfoManager {
    storeFeedback(payload: INeoReleaseInfo): Promise<any>;
}
