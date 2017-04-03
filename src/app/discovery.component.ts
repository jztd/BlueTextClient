import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from './message.service';

import { Device } from './device';


@Component({
	moduleId: module.id,
	selector: 'discovery',
	templateUrl: './discovery.component.html',
	styleUrls: ['./discovery.component.css']
})
export class SocketConnectionComponent implements OnInit  { 

	localDevices: Device[];
	connected: boolean = false;
	errorMsg: string;

	constructor(private messageService: MessageService, private router: Router)
	{
		this.localDevices = Array();
		this.errorMsg = "";

	}

	connect(addr: string): void
	{
		this.errorMsg = "";
		this.messageService.setAddress(addr);
	}
	ngOnInit(): void
	{
		this.messageService.newConnection.subscribe(data => this.handleMessage(data))
	}

	handleMessage(data: any): void
	{
		if(data.connected === "connected")
		{
			this.router.navigate(['/threads']);
			
		}
		else
		{
			this.errorMsg = "unable to connect, please check the address supplied by the app";
		}
	}


}