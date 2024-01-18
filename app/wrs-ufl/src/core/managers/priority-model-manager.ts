import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../../utils/logger';
import { IStoreUserFeedbackPayload } from '../interfaces/store-user-feedback-payload.interface';
import { Priority } from '../typeorm/entities/wrs-priority.entity';
import { UserFeedbackDao } from '../typeorm/user-feedback-dao';
import { UserFeedbackManager } from './_user-feedback-manager.interface';

export class PriorityUserFeedbackManager implements UserFeedbackManager {
    userFeedbackDao: UserFeedbackDao<Priority>;

    constructor() {
        this.userFeedbackDao = new UserFeedbackDao(Priority);
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
            Logger.error('An error occurred to store user feedback for Priority: ', error);
            throw error;
        }
    }
}
