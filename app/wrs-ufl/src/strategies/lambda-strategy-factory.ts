import { ALBEvent } from 'aws-lambda';
import { MigrationManager } from '../core/typeorm/migration-manager';
import { config } from '../config/app-config';
import { DisciplineUserFeedbackManager } from '../core/managers/discipline-model-manager';
import { JobTypeUserFeedbackManager } from '../core/managers/job-type-model-manager';
import { OutageUserFeedbackManager } from '../core/managers/outage-model-manager';
import { PriorityUserFeedbackManager } from '../core/managers/priority-model-manager';
import { UCRUserFeedbackManager } from '../core/managers/ucr-model-manager';
import { CorsResponse } from './cors-response.strategy';
import { LambdaStrategyFactoryOutput } from './lambda-strategy-factory-output.interface';
import { LambdaStrategy } from './lambda-strategy.interface';
import { MigrationStrategy } from './migration.strategy';
import { StoreUserFeedbackStrategy as StoreStrategy } from './store-user-feedback.strategy';

export class LambdaStrategyFactory {
    private pathVsStrategyMap = new Map<string, () => LambdaStrategy>();
    constructor() {
        this.populateMap();
    }

    async create(event: ALBEvent) {
        const decodedPath = decodeURI(event.path);
        const path = `${event.httpMethod} ${decodedPath}`;

        const output: LambdaStrategyFactoryOutput = {
            strategy: null,
            pathParams: new Map<string, string>()
        };

        for (const key of Array.from(this.pathVsStrategyMap.keys())) {
            const matches = path.match(key);
            if (matches) {
                const concreteStrategy = this.pathVsStrategyMap.get(key);
                output.strategy = concreteStrategy();
                break;
            }
        }

        return output;
    }

    private populateMap() {
        const POST_PREFIX = `POST ${config.endpointPrefix}`;
        const OPTIONS_PREFIX = `OPTIONS ${config.endpointPrefix}`;

        this.pathVsStrategyMap.set(`${POST_PREFIX}/outage`, () => new StoreStrategy(new OutageUserFeedbackManager()));
        this.pathVsStrategyMap.set(`${OPTIONS_PREFIX}/outage`, () => new CorsResponse());

        this.pathVsStrategyMap.set(`${POST_PREFIX}/priority`, () => new StoreStrategy(new PriorityUserFeedbackManager()));
        this.pathVsStrategyMap.set(`${OPTIONS_PREFIX}/priority`, () => new CorsResponse());

        this.pathVsStrategyMap.set(`${POST_PREFIX}/discipline`, () => new StoreStrategy(new DisciplineUserFeedbackManager()));
        this.pathVsStrategyMap.set(`${OPTIONS_PREFIX}/discipline`, () => new CorsResponse());

        this.pathVsStrategyMap.set(`${POST_PREFIX}/job-type`, () => new StoreStrategy(new JobTypeUserFeedbackManager()));
        this.pathVsStrategyMap.set(`${OPTIONS_PREFIX}/job-type`, () => new CorsResponse());

        this.pathVsStrategyMap.set(`${POST_PREFIX}/ucr`, () => new StoreStrategy(new UCRUserFeedbackManager()));
        this.pathVsStrategyMap.set(`${OPTIONS_PREFIX}/ucr`, () => new CorsResponse());

        this.pathVsStrategyMap.set(
            `${POST_PREFIX}/run-migration`,
            () => new MigrationStrategy(new MigrationManager(MigrationManager.RUN))
        );
        this.pathVsStrategyMap.set(`${OPTIONS_PREFIX}/run-migration`, () => new CorsResponse());
    }
}
