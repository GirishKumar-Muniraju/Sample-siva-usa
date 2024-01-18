import { Logger } from '../../utils/logger';
import * as jsonwebtoken from 'jsonwebtoken';

export class JwtHelper {
    decode(token: string) {
        return jsonwebtoken.decode(token, { complete: true });
    }

    verify(token: string, pem: string,
        iss: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            jsonwebtoken.verify(token,
                pem,
                {
                    issuer: iss,
                }, (err, decoded: jsonwebtoken.JwtPayload) => {
                    if (err) {
                        Logger.error(JSON.stringify(err));
                        reject(false);
                    }

                    resolve(true);
                });
        });
    }
}
