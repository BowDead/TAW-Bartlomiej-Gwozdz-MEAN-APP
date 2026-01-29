import { RequestHandler, Request, Response, NextFunction } from 'express';
import { config } from "../config";

export const checkPostCount: RequestHandler = (request: Request, response: Response, next: NextFunction) => {
    console.log('params', request.params)
    const { num} = request.params;
    const parsedValue = parseInt(num, 10);
    console.log('parsedValue: ',parsedValue);
    if (isNaN(parsedValue) || parsedValue >= config.supportedPostCount) {
        return response.status(400).send('Brak lub niepoprawna wartość!');
    }
    next();
};

