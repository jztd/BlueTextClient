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

	deviceLoaded: boolean;

	default_device: Device =  {uuid:"123456789", address:"0987654321", name:"jflajslfjlaksdf"};
	constructor(private router: Router, private messageService: MessageService)
	{
		this.deviceLoaded = false;
	}
	ngOnInit(): void
	{
		console.log("app.component init();");
		//this.messageService.setDevice("","","");
		// see if device is already loaded
		if(!this.messageService.checkConnected())
		{
			this.router.navigate(['/discover']);
		}
		else
		{
			let conversation: string;
			this.messageService.getActiveCoversation().then(result => {
				// we have a device if no conversation is loaded, go to the list of threads
				conversation = result;
				if(conversation === "")
				{
					this.router.navigate(['/threads']);
				}

				// else there was an open conversation, go to that conversation page
				else
				{
					this.router.navigate(['/conversation', conversation]);
				}
			});
			
		}

	}	
}
