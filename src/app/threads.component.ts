import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from './message.service';

@Component({
	moduleId: module.id,
	selector: 'threads',
	templateUrl: './threads.component.html',
	styleUrls: ['./threads.component.css']
})
export class ThreadsComponent implements OnInit
{
	threads: string[];
	contacts: string[];
	showContactsScreen: boolean = false;
	constructor(private messageService: MessageService, private router: Router)
	{
		this.threads = Array();
	}

	ngOnInit(): void
	{
		this.messageService.getThreads().then(result => {
			this.threads = result["threads"];
		});
		this.messageService.newThread.subscribe(result => this.addThread(result));
		this.messageService.getContacts().then(result => this.contacts = result);
	}

	addThread(name: string): void
	{
		let i = this.threads.indexOf(name);
		if( i > -1)
		{
			this.threads.splice(i, 1);
		}
		this.threads.unshift(name);
	}
	removeThread(name: string): void
	{
		let i = this.threads.indexOf(name);
		if(i > -1)
		{
			this.threads.splice(i,1);
		}
		this.messageService.removeThread(name);
	}
	navigateNewThread(name: string): void
	{
		this.messageService.addThread(name);
		this.router.navigate(['/conversation', name]);
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