import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthorizationInterceptor } from './core/interceptors/authorization.interceptor';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, NgbModule,HttpClientModule],
  providers: [{provide:HTTP_INTERCEPTORS,useClass:AuthorizationInterceptor,multi:true}],
  bootstrap: [AppComponent],
})
export class AppModule {}
