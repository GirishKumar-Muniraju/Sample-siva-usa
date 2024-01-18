import express from 'express';
import helmet from 'helmet';
import * as idx from './index';
import { RequestConverter } from './models/request-converter';
import { Logger } from './utils/logger';
export const app = express();
import dotenv from 'dotenv';
dotenv.config();
app.use(helmet.hidePoweredBy());
app.use(express.json());
app.use('/', async (req: express.Request, res: express.Response) => {
    // Translate request object to be given to lambda
    const albEvent = await RequestConverter.expressToALB(req);
    // Call Lambda handler
    const albResult = await idx.handler(albEvent);
    // Prepare and send the response back
    res.statusCode = albResult.statusCode;
    res.statusMessage = albResult.statusDescription;
    Object.keys(albResult.headers).forEach((key) => {
        res.setHeader(key, albResult.headers[key].toString());
    });
    res.send(albResult.body);
});
const port = process.env.PORT;
export const server = app.listen(port, () => {
    Logger.info(`Application is listening at port: ${port}`);
});
