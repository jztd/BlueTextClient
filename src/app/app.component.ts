import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Device } from './device'
import { MessageService } from './message.service';
@Component({
	moduleId: module.id,
	selector: 'BlueText',
	templateUrl: './bluetext.component.html',
	styleUrls: ['./blueText.component.css']
})
export class AppComponent implements OnInit
{ 

	constructor(private router: Router, private messageService: MessageService){}
	
	ngOnInit(): void
	{
		// see if device is already loaded
		if(!this.messageService.checkConnected())
		{
			this.router.navigate(['/discover']);
		}
		else
		{
			this.router.navigate(['/threads']);	
		}

	}	
}
