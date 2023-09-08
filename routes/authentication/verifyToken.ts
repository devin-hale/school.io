import { Request, NextFunction, Response, RequestHandler } from "express";
import jwt from 'jsonwebtoken';
import 'dotenv/config.js'

const secretKey: string = process.env.SECRET_KEY!;

interface TokenRequest extends Request {
	token: string;
}

const  verifyToken:any = (req: TokenRequest, res:Response, next:NextFunction) =>  {
	const bearerHeader = req.headers['authorization'];

	if(typeof bearerHeader !== 'undefined') {
		const bearerToken = bearerHeader.split(' ')[0];

		jwt.verify(bearerToken, secretKey, (err, authData) => {
			if(err) {
				res.sendStatus(403);
			} else {
				next();	
			}
		} )
	} else {
		res.sendStatus(403);
	}

}

export default verifyToken;

//Format
//Authorization: Bearer <access_token>