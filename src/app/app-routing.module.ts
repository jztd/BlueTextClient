import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import components
import {ThreadsComponent} from './threads.component';
import {ConversationComponent} from './conversation.component';
import {SocketConnectionComponent} from './discovery.component';

const routes: Routes = [
{path: '', redirectTo: '/threads', pathMatch: 'full' },
{path:'threads', component: ThreadsComponent},
{path:'conversation/:name', component: ConversationComponent},
{path: 'discover', component: SocketConnectionComponent}
];

@NgModule(
{
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
	
})
export class AppRoutingModule
{

}
