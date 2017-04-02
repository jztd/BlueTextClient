import {Injectable} from '@angular/core';

import { Device } from './device';
import { Message } from './message';

import { Subject } from 'rxjs/Subject';

const messageArray: Message[] = [ 
{d:"o", c:"dork"}, 
{d:"i", c:"nerd"},
{d:"i", c:"I LIKE EGGS"}
];

const otherMessageArray: Message[] =
[
{d:"o", c:"wazzup"},
{d:"i" ,c:"nadda"},
{d:"o", c:"Biatch"}
];

const contactArray: string[] = ["Shayla", "Jessica", "Mom", "Dad", "Larry"];

@Injectable()
export class MessageService
{
	thisNumber: string;
	private newMessagesSource = new Subject<Message>();
	private newThreadSource = new Subject<any>();
	newThread = this.newThreadSource.asObservable();
	newMessage = this.newMessagesSource.asObservable();
	storage: Storage;
	activeThread: string;
	private socket;
	constructor()
	{
		this.onInit();
	}

	onInit(): void
	{
		// subscribe to local storage changes
		this.storage = localStorage;
		if(!this.checkAvaliableStorage())
		{
			alert("local storage not available");
		}
		this.thisNumber = this.storage.getItem("BlueTextThisNumber");
		let conv = this.storage.getItem("BlueTextConversation");
		if(conv != null)
		{
			this.activeThread = conv;
		}
		else
		{
			this.activeThread = "";
		}
		//this.generateConversations();
		let that = this;
		window.addEventListener('storage', function(e){ that.handleMessage(e)});

	}

// checks local storage if device exists
	checkConnected(): boolean
	{
		//alert(this.storage.getItem("BlueTextDevice"));
		if(!this.storage.getItem("BlueTextConnected"))
		{
			return false;
		}
		return true;
	}

// sets a device 
	setDevice(uuid:string, address:string, name:string): void
	{
		let device: Device = { uuid: uuid, address: address, name: name}
		this.storage.setItem("BlueTextDevice", JSON.stringify(device));
	}

// gets the name of the conversation that was last used
	getActiveCoversation(): Promise<string>
	{
		let conversation: string;
		conversation = this.storage.getItem("BlueTextConversation");
		if(conversation === null)
		{
			return Promise.resolve("");
		}
		return Promise.resolve(conversation);
	}

	getCoversationMessages(name:string): Promise<Message[]>
	{
		if(!this.storage.getItem(name))
		{
			return Promise.resolve(new Array());
		}
		else
		{
			let data = this.storage.getItem(name);
			let parseData = JSON.parse(data);
			return Promise.resolve(parseData);
		}
	}

	generateConversations(): void
	{
		this.storage.removeItem("BlueTextThisNumber");
		this.storage.setItem("BlueTextThisNumber", "3608090876");
		this.storage.setItem("BlueTextConversation", "Shayla");
		this.storage.setItem("BlueTextThreads", JSON.stringify({threads:["Shayla","Jessica","Dad", "Mom"]}));
		this.storage.setItem("Shayla", JSON.stringify(messageArray));
		this.storage.setItem("Jessica", JSON.stringify(otherMessageArray));
		this.storage.setItem("BlueTextContacts", JSON.stringify(contactArray));
	}
// checks to make sure local storage is available, you kinda need this
	checkAvaliableStorage(): boolean
	{
		try
		{
			let storage = window['localStorage'];
			storage.setItem('x', 'avaliable');
			storage.removeItem('x');
			return true;
		}
		catch(e)
		{
			return false;
		}
	}

	getNumber(): Promise<string>
	{
		if(this.thisNumber !== null)
		{
			return Promise.resolve(this.thisNumber);
		}
		else
		{
			return Promise.reject("no number stored");
		}
	}

	sendMessage(content: string): void
	{
		// what do we need to do?
		// get messages, add new message to array
		// save messages again
		let messages: Message[];
		let number: string;
		let conversation: string;
			this.getActiveCoversation().then(result => {
				conversation = result;
				this.getNumber().then(result => {
					number = result;
					this.getCoversationMessages(conversation).then(result => {
						messages = result;
						let msg =  {d:'o', c:content};
						messages.push(msg);
						this.storage.setItem(conversation, JSON.stringify(messages));
						this.newMessagesSource.next(msg);

						// handle bluetooth stuff here
					});
				});
			});
	}

	removeConversation(): void
	{
		this.storage.setItem("BlueTextConversation", "");
		this.activeThread = "";
	}

	setConversation(name: string): void
	{
		this.storage.setItem("BlueTextConversation", name);
		this.activeThread = name;
	}

	getThreads(): Promise<string[]>
	{
		let T = JSON.parse(this.storage.getItem("BlueTextThreads"));
		return Promise.resolve(T);

	}

	getContacts(): Promise<string[]>
	{
		let contacts = JSON.parse(this.storage.getItem("BlueTextContacts"));
		return Promise.resolve(contacts);
	}

	addThread(name: string): void
	{
		let t = this.storage.getItem("BlueTextThreads");
		let T = JSON.parse(t)["threads"];

		let i = T.indexOf(name);
		if(i > -1)
		{
			T.splice(i,1);
		}
		T.unshift(name);
		this.storage.setItem("BlueTextThreads", JSON.stringify({threads:T}));
		this.newThreadSource.next(name);
	}

	removeThread(name: string): void
	{
		let T = JSON.parse(this.storage.getItem("BlueTextThreads"))['threads'];

		let i = T.indexOf(name);
		if(i > -1)
		{
			T.splice(i,1);
		}
		this.storage.setItem("BlueTextThreads", JSON.stringify({threads:T}));
		this.storage.removeItem(name);
	}

	setAddress(addr: string): void
	{
		this.storage.setItem("BlueTextAddress", addr);
	}
	handleMessage(msg: any): void
	{
		if(msg.key === this.activeThread)
		{
			let txtArray = JSON.parse(msg.newValue);
			this.newMessagesSource.next(txtArray[txtArray.length - 1]);
		}
	}

}