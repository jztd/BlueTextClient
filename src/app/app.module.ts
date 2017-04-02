import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'

import { AppComponent }  from './app.component';
import { ThreadsComponent } from './threads.component';
import { ConversationComponent } from './conversation.component';
import { SocketConnectionComponent } from './discovery.component';

import { MessageService } from './message.service';

import { AppRoutingModule } from './app-routing.module';
@NgModule({
  imports:      [ BrowserModule, AppRoutingModule, FormsModule ],
  declarations: [ AppComponent, ThreadsComponent, ConversationComponent, SocketConnectionComponent ],
  providers: [MessageService],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
