import 'reflect-metadata';
import express, {Request, Response, NextFunction}  from 'express';
import 'express-async-errors';
import routes from './routes';
import uploadConfig from './config/upload';
import './database'

import AppError from './errors/AppError';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

//Exception Handling
app.use((err: Error, request:Request, response:Response, next:NextFunction) =>{
    if(err instanceof AppError){ //Se o erro captado for da instacia do erro criado 
        return response.status(err.statusCode).json({
            status: 'Error',
            message: err.message
        });
    }

    console.log(err);

    //Retorna um erro interno que nao estava previsto 
    return response.status(500).json({
        status: 'status',
        message: 'Internal server error.'
    });
});

app.listen(3333, () => {
    console.log("🚀 Server started on port 3333")
})