import { Express } from 'express';
import request from 'supertest';

async function testJWT(app: Express): Promise<string> {
	const loginEmail: string = 'zaneson@mail.com';
	const loginPassword: string = '123456';

	const loginPostReq: any = await request(app)
		.post('/login')
		.set('Content-Type', 'application/json; charset=utf-8')
		.send({ email: loginEmail, password: loginPassword });

	return `Bearer ${loginPostReq.body}`;
}

export default testJWT;
