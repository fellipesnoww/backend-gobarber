//Anexa um tipo ao express
declare namespace Express {
    export interface Request {
        user: {
            id: string;
        };
    }
}