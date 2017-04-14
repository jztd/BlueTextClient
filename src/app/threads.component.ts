import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from './message.service';

import { Thread } from './thread';
@Component({
	moduleId: module.id,
	selector: 'threads',
	templateUrl: './threads.component.html',
	styleUrls: ['./threads.component.css']
})
export class ThreadsComponent implements OnInit
{
	threads: Thread[];
	contacts = Array();
	showContactsScreen: boolean = false;
	constructor(private messageService: MessageService, private router: Router){}

	ngOnInit(): void
	{
		this.messageService.getThreads().then(result => {
			this.threads = result;
			console.log(this.threads);
		});
		this.messageService.newThread.subscribe(result => this.addThread(result));
		this.messageService.getContacts().then(result => 
			{
				this.contacts = result;
				console.log(this.contacts);
			});
	}

	addThread(thread: any): void
	{
		this.threads[thread.number] = thread.name;
	}
	removeThread(number: string): void
	{
			delete this.threads[number];
	}

	navigateNewThread(number: string, name:string): void
	{
		this.messageService.addThread(name, number);
		this.router.navigate(['/conversation', number]);
	}

	showContacts(): void
	{
		if(this.showContactsScreen === false)
		{
			this.showContactsScreen = true;
		}
		else
		{
			this.showContactsScreen = false;
		}
	}

}