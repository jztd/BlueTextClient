import { Component, OnInit, ViewChild, AfterViewChecked, AfterViewInit} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Message } from './message';
import { MessageService } from './message.service';

@Component({
	moduleId: module.id,
	selector: 'conversation',
	templateUrl: './conversation.component.html',
	styleUrls: ['./conversation.component.css']
})

export class ConversationComponent implements OnInit, AfterViewChecked
{
	messages: Message[];
	thisNumber: string;
	conversationName: string;
	defaultMessage = "";
	constructor(private messageService: MessageService, private route: ActivatedRoute, private location: Location, private router: Router)
	{
		this.messages = new Array();
	}

	ngOnInit(): void
	{
		this.route.params.subscribe((params: Params) => this.loadMsgs(params['name']));
		this.messageService.newMessage.subscribe(result => this.handleNewMessage(result));

	}

	loadMsgs(name: string): void
	{
		this.conversationName = name;
		this.messageService.getNumber().then(result => this.thisNumber = result);
		this.messageService.setConversation(this.conversationName);
		this.messageService.getCoversationMessages(this.conversationName).then(result => 
		{
			this.messages = result;	
		}).catch( error => console.log(error));
	}

	ngAfterViewChecked(): void
	{
		this.scrollToBottom();
	}

	scrollToBottom(): void
	{
		let element = document.getElementById('mainConversation');
		element.scrollTop = element.scrollHeight;
	}

	toThreads():void
	{
		this.messageService.removeConversation();
		this.router.navigate(['/threads']);
	}
	handleNewMessage(msg: Message): void
	{
		this.messages.push(msg);
	}

	send(message: string): void
	{
		this.messageService.sendMessage(message);
		this.defaultMessage = "";
	}
	
}