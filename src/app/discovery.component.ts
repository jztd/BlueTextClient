import { Component, OnInit } from '@angular/core';

import { MessageService } from './message.service';

import { Device } from './device';

//import * as bluetooth from 'nativescript-bluetooth';

@Component({
	moduleId: module.id,
	selector: 'discovery',
	templateUrl: './discovery.component.html',
	styleUrls: ['./discovery.component.css']
})
export class SocketConnectionComponent implements OnInit  { 

	scanning: boolean = false;
	localDevices: Device[];

	constructor(private messageService: MessageService)
	{
		this.localDevices = Array();

	}

	connect(addr: string): void
	{
		this.messageService.setAddress(addr);
	}
	ngOnInit(): void
	{
		this.messageService.newMessage.subscribe(data => this.handleMessage(data))
	}

	handleMessage(data: any): void
	{

	}


}