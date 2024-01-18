import { IStoreUserFeedbackPayload } from '../interfaces/store-user-feedback-payload.interface';

export interface UserFeedbackManager {
    storeFeedback(payload: IStoreUserFeedbackPayload): Promise<any>;
}
