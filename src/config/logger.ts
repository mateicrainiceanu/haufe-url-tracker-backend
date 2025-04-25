import pino, { multistream } from 'pino';
import { fileLogLever, logLevel } from './global';
import { destinationLogFile } from './global';
import fs from 'fs';
import path from 'path';

// const logDirectory = path.dirname(destinationLogFile);
// if (!fs.existsSync(logDirectory)) {
//     fs.mkdirSync(logDirectory, { recursive: true });
// }

// if (!fs.existsSync(destinationLogFile)) {
//     fs.writeFileSync(destinationLogFile, '', { flag: 'w' });
// }
// const stream = fs.createWriteStream(destinationLogFile, { flags: 'a' });

const logger = pino({
    level: logLevel,
    transport: {
        targets: [
            {
                level: logLevel,
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'SYS:standard',
                    ignore: 'pid,hostname',
                },
            },
            // {
            //     level: fileLogLever,
            //     target: 'pino/file',
            //     options: { destination: destinationLogFile }
            // }
        ]
    }
});

export default logger;