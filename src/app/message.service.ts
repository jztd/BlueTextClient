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
	private contacts: {}; // dict of phoneNumber: name;
	private threads: {}; // dict of phoneNumber: to threads;
	private socket;
	private address;
	private thisNumber;

	newConnection = this.newConnectionSource.asObservable();
	newThread = this.newThreadSource.asObservable();
	newMessage = this.newMessagesSource.asObservable();

	constructor()
	{
		this.onInit();
	}

	onInit(): void
	{
		this.address = "";
		this.thisNumber = "123-4567";
		this.activeThread = "";
		this.connected = false;
		this.contacts = {};
		this.threads = {};
	}

// checks local storage if device exists
	checkConnected(): boolean
	{
		return this.connected;
	}
	
	setAddress(addr: string): void
	{
		this.address = addr;
		this.connect(addr);
	}
	
// gets the message associated with a name	
	getThreadDetails(number): Promise<any>
	{
		return Promise.resolve(this.threads[number]);
	}

	sendMessage(content: string): void
	{
		// we only send messages to active thread so...
		this.threads[this.activeThread].AddMessage(this.activeThread, content);
		// console.log('msg service: send message');
		// console.log(this.threads[this.activeThread]);
		// let M =  new Message();
		// M.c = content;
		// M.d = 'o';
		// this.newMessagesSource.next(M);
		// TODO: handle sending the message to the phone;

	}

	removeConversation(): void
	{
		this.activeThread = "";
	}

	setConversation(number: string): void
	{
		this.activeThread = number;
	}

	getThreads(): Promise<any> // returns an array of thread objects
	{
		let T = Array();

		for(var K in this.threads)
		{
			T.push(this.threads[K]);
		}
		return Promise.resolve(T);
	}

	getContacts(): Promise<any>
	{
		let T = Array();
		for(var K in this.contacts)
		{
			T.push({number:K, name: this.contacts[K]});
		}
		return Promise.resolve(T);
	}

	addThread(name: string, num: string = ""): void
	{

		// if num is blank lookup number from contacts
		if(num === "")
		{
			num = this.contacts[name];
		}
		let T = new Thread(num,name);
		this.threads[num] = T;
		this.newThreadSource.next(name);
	}

	removeThread(number: string): void
	{
		let i = Object.keys(this.threads).indexOf(number)
		if( i > -1)
		{
			delete this.threads[number];
		}

		// TODO: send command to phone to delete threads
	}
	
	// when new messages come in it hits this message, also if you send a message from your phone it shoudl hit here too
	handleNewMessage(msg: any): void
	{
		console.log('msg service handle message:');
		console.log(msg);
		let M = new Message();
		
		M.d = 'o';
		M.c = msg.content;

		if(msg.number === this.thisNumber)
		{
			M.d = 'i';
		}

		// if this message is for the thread that is being displayed
		if(msg.number === this.activeThread)
		{
			this.newMessagesSource.next(M);
		}

		// add message to its thread
		this.threads[msg.number].AddMesage(msg.number, msg.content);

	}

	connect(addr: string){
		this.socket = io("http://" + addr);
		
		this.socket.on('connect', () => { 
			console.log("connected");
			this.connected = true;
			// ask for contacts
			this.socket.emit('client-connect');
			this.socket.emit('get-contacts');
			// ask for threads
			this.socket.emit('get-threads');
		});
		
		this.socket.on('connect_error', (err) => {
			console.log(err);
			this.newConnectionSource.next({connected: "error"});
		});

		this.socket.on('message', (data) =>{
			this.handleNewMessage(data);
			console.log(data);
		});

		// phone sent us contacts
		this.socket.on('contacts', (data) =>
		{
			this.contacts = JSON.parse(data).contacts; // parse json object should be in form {contacts: {}}
		});

		// phone sent us current threads
		this.socket.on('threads', (data) => {
			let obj = JSON.parse(data).threads; // parse the json object should be in form {threads: [individual threads]}
			console.log(obj.length);
			for(let j = 0; j < obj.length; j++)
			{
				let D = obj[j];
				let T = new Thread(D.number, D.name);

				for( let i = 0; i < D.messages.length; i++)
				{
					T.AddMessage(D.messages[i].number, D.messages[i].content);
				}
				this.threads[D.number] = T;
			}

			this.newConnectionSource.next({connected: "connected"});
			console.log(this.contacts);
			console.log(this.threads);

		});

	}

}





