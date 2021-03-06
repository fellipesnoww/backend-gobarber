import {Request, Response, NextFunction} from 'express';
import {verify} from 'jsonwebtoken';

import authConfig from '../config/auth';

import AppError from '../errors/AppError';

interface TokenPayload{
    iat: number,
    exp: number,
    sub: string
};

export default function ensureAuthenticated(request: Request, response:Response, next:NextFunction): void{
    //Validação do token
    const authHeader = request.headers.authorization;

    if(!authHeader){
        throw new AppError('JWT Token is missing', 401);
    }

    //Desestruturação ignorando o primeiro parametro do split
    const [, token] = authHeader.split(' ');

    try {
        const decoded = verify(token, authConfig.jwt.secret);
        const {sub} = decoded as TokenPayload; //força que o decoded seja do tipo do interface

        request.user = {
            id: sub
        };
        
        return next();
    } catch {
        throw new AppError('Invalid JWT Token', 401);
    }

}