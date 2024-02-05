import { IStoreUserFeedbackPayload } from '../interfaces/neo-release-info.interface';
import { Outage } from '../typeorm/entities/wrs-outage.entity';
import { UserFeedbackDao } from '../typeorm/user-feedback-dao';
import { Logger } from '../../utils/logger';
import { UserFeedbackManager } from './_user-feedback-manager.interface';
import { v4 as uuidv4 } from 'uuid';

export class OutageUserFeedbackManager implements UserFeedbackManager {
    userFeedbackDao: UserFeedbackDao<Outage>;

    constructor() {
        this.userFeedbackDao = new UserFeedbackDao(Outage);
    }

    async storeFeedback(userFeedback: IStoreUserFeedbackPayload): Promise<any> {
        try {

            const input = {
                ...userFeedback,
                id: uuidv4(),
                updateUserId: userFeedback.slid,
                createUserId: userFeedback.slid,
                createDateTime: new Date(),
                updateDateTime: new Date(),
            };

            const result = await this.userFeedbackDao.storeFeedback(input);
            return result;
        } catch (error) {
            Logger.error('An error occurred to store user feedback for Outage: ', error);
            throw error;
        }
    }
}
