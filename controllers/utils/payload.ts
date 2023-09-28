export class Payload {
	message: string;
	statusCode: number;
	content: any | null;

	constructor(message:string, statusCode:number, content:any|null) {
		this.message = message;
		this.statusCode = statusCode;
		this.content = content;
	}
}
