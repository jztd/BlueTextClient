import {Injectable} from '@angular/core';

import { Message } from './message';
import { Thread } from './thread';

import { Subject } from 'rxjs/Subject';

import * as io from "socket.io-client";



@Injectable()
export class MessageService
{
	private newMessagesSource = new Subject<Message>(); // new messages added here if they are part of the active thread
	private newThreadSource = new Subject<any>(); // when a message comes in that is not part of the thread list it is added here
	private newConnectionSource = new Subject<any>();
	private connected: boolean; // boolean flag if we are connected to the android server
	private activeThread: string; // the current thread the user is viewing
	private contacts; // dict of name: phonenumber;
	private threads; // dict of names to threads;
	private socket;
	private address;

	newConnection = this.newConnectionSource.asObservable();
	newThread = this.newThreadSource.asObservable();
	newMessage = this.newMessagesSource.asObservable();

	constructor()
	{
		this.onInit();
	}

	onInit(): void
	{
		// subscribe to local storage changes
		this.address = "";
		this.activeThread = "";
		this.connected = false;
		this.contacts = {};
		this.threads = {};

		this.socket = io("http://localhost:5000");
		this.socket.on('connect', () => { 
			console.log("connected");
			this.connected = true;
		});
	
	}

// checks local storage if device exists
	checkConnected(): boolean
	{
		return this.connected;
	}
	
	setAddress(addr: string): void
	{
		this.address = addr;
	}
// gets the name of the conversation that was last used
	
	getThreadMessages(name:string): Promise<Message[]>
	{
		let test = name in this.threads;
		if(test)
		{
			return Promise.resolve(this.threads[name]);
		}
		else
		{
			return Promise.resolve(Array());
		}
	}

	sendMessage(content: string): void
	{
		// we only send messages to active thread so...
		this.threads[this.activeThread].AddMessage(this.contacts[this.activeThread], content);
		// TODO: handle sending the message to the phone;

	}

	removeConversation(): void
	{
		this.activeThread = "";
	}

	setConversation(name: string): void
	{
		this.activeThread = name;
	}

	getThreads(): Promise<string[]>
	{
		let T = this.threads.keys();
		return Promise.resolve(T);

	}

	getContacts(): Promise<string[]>
	{
		return Promise.resolve(this.contacts);
	}

	addThread(name: string, num: string = ""): void
	{

		// if num is blank lookup number from contacts
		if(num === "")
		{
			num = this.contacts[name];
		}
		let T = new Thread(num,name);
		this.threads[name] = T;
		this.newThreadSource.next(name);
	}

	removeThread(name: string): void
	{
		let i = this.threads.indexOf(name);
		if( i > -1)
		{
			delete this.threads[name];
		}

		// TODO: send command to phone to delete threads
	}
	
	handleMessage(msg: any): void
	{
		if(msg.key === this.activeThread)
		{
			let txtArray = JSON.parse(msg.newValue);
			this.newMessagesSource.next(txtArray[txtArray.length - 1]);
		}
		else if(msg.key === "BlueTextConnected")
		{
			this.newConnectionSource.next({conected:msg.newValue});
		}
	}

}





