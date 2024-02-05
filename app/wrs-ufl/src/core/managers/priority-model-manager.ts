import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../../utils/logger';
import { INeoReleaseInfo } from '../interfaces/neo-release-info.interface';
import { Priority } from '../typeorm/entities/wrs-priority.entity';
import { NeoReleaseInfoDao } from 'core/typeorm/user-feedback-dao';
import { NeoReleaseInfoManager } from './_user-feedback-manager.interface';

export class PriorityUserFeedbackManager implements NeoReleaseInfoManager {
    userFeedbackDao: NeoReleaseInfoDao<NeoReleaseInfo>;

    constructor() {
        this.userFeedbackDao = new NeoReleaseInfoDao(Priority);
    }

    async storeFeedback(newReleaseInfo: INeoReleaseInfo): Promise<any> {
        try {

            const input = {
                ...newReleaseInfo,
                id: uuidv4(),
                updateUserId: newReleaseInfo.updateUserId,
                createUserId: newReleaseInfo.createdUserId,
                createDateTime: new Date(),
                updateDateTime: new Date(),
            };

            const result = await this.userFeedbackDao.storeFeedback(input);
            return result;
        } catch (error) {
            Logger.error('An error occurred to store user feedback for Priority: ', error);
            throw error;
        }
    }
}
