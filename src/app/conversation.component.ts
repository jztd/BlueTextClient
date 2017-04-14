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
	conversationName: string;
	defaultMessage = "";
	constructor(private messageService: MessageService, private route: ActivatedRoute, private location: Location, private router: Router)
	{
		this.messages = new Array();
	}

	ngOnInit(): void
	{
		this.route.params.subscribe((params: Params) => this.loadMsgs(params['name']));
		this.messageService.newMessage.subscribe(result => 
		{
			console.log(result);
			this.handleNewMessage(result);
		});

	}

	loadMsgs(name: string): void
	{
		this.messageService.setConversation(name);
		this.messageService.getThreadDetails(name).then(result => 
		{
			this.messages = result.messages;
			this.conversationName = result.name;

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
		//console.log(msg);
		this.messages.push(msg);
	}

	send(message: string): void
	{
		this.messageService.sendMessage(message);
		this.defaultMessage = "";
	}
	
}