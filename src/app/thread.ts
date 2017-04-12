import {Message} from './message';

export class Thread
{
	private name: string;
	private phoneNumber:string;
	messages: Message[];

	constructor(num: string, name: string)
	{
		this.name = name;
		this.phoneNumber = num;
		this.messages = Array();
	}

	AddMessage(phoneNumber: string, msg: string): void
	{
		let d = "i"; // assume message is incoming
		let c = msg;
		if(phoneNumber === this.phoneNumber)
		{
			d = 'o'; // phone number matches this contacts phone number so it's an outgoing message
		}
		let m = new Message();
		m.d = d;
		m.c = c;
		this.messages.push(m);
	}

	GetName(): string
	{
		return this.name;
	}
	GetPhoneNumber(): string
	{
		return this.phoneNumber;
	}
}