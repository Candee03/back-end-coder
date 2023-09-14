import winston from 'winston'
import config from '../config/env.js'


//*-----CONFIGURACION--------

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors : {
        fatal: 'bold redBG',
        error: 'bold red',
        warning: 'bold yellow',
        info: 'bold greenBG',
        http: 'italic blue',
        debug: 'italic white'
    }
}


let logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({ 
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ filename: 'errors.log', level: 'error' }),
    ]
})

if (config.ENVIROMENT === 'desarrollo') {
    logger = winston.createLogger({
        levels: customLevelOptions.levels,
        transports: [
            new winston.transports.Console({ 
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevelOptions.colors }),
                    winston.format.simple()
                )
            })
        ]
    });
}

export const loggerMiddleware = (req, res, next) => {
    req.logger = logger;
    logger.http(`Method: ${req.method} => Route: ${req.url} || Date: ${new Date().toLocaleString()}`);
    next();
}