import { UCR } from './../typeorm/entities/wrs-urc.entity';
import { UserFeedbackDao } from './../typeorm/user-feedback-dao';
import { IStoreUserFeedbackPayload } from '../interfaces/store-user-feedback-payload.interface';
import { Logger } from '../../utils/logger';
import { UserFeedbackManager } from './_user-feedback-manager.interface';
import { v4 as uuidv4 } from 'uuid';
export class UCRUserFeedbackManager implements UserFeedbackManager {
    userFeedbackDao: UserFeedbackDao<UCR>;

    constructor() {
        this.userFeedbackDao = new UserFeedbackDao(UCR);
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
            Logger.error('An error occurred to store user feedback for UCR: ', error);
            throw error;
        }
    }
}
