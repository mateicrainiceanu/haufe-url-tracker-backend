import pino, { multistream } from 'pino';
import { fileLogLever, logLevel } from './global';
import { destinationLogFile } from './global';
import fs from 'fs';
import path from 'path';

const logDirectory = path.dirname(destinationLogFile);
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

if (!fs.existsSync(destinationLogFile)) {
    fs.writeFileSync(destinationLogFile, '', { flag: 'w' });
}
const stream = fs.createWriteStream(destinationLogFile, { flags: 'a' });

const streams = [
    //{ stream: stream, level: fileLogLever, ignore: 'pid,hostname' },
    {stream: pino.transport({
        target: 'pino-pretty',
        level: logLevel,
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
        },
    })},
]

const logger = pino({}, multistream(streams));

export default logger;