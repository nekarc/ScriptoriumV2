import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AdvicepageComponent } from './advicepage/advicepage.component';
import { FooterComponent } from './footer/footer.component';
import { SearchpageComponent } from './searchpage/searchpage.component';
import { BookpageComponent } from './bookpage/bookpage.component';
import { ProfilepageComponent } from './profilepage/profilepage.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { SignuppageComponent } from './signuppage/signuppage.component';
import { BorrowpageComponent } from './borrowpage/borrowpage.component';
import { RenewpageComponent } from './renewpage/renewpage.component';
import { ReturnpageComponent } from './returnpage/returnpage.component';
import { AddbookpageComponent } from './addbookpage/addbookpage.component';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StorageServiceModule } from 'ngx-webstorage-service';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomepageComponent,
    AdvicepageComponent,
    FooterComponent,
    SearchpageComponent,
    BookpageComponent,
    ProfilepageComponent,
    LoginpageComponent,
    SignuppageComponent,
    BorrowpageComponent,
    RenewpageComponent,
    ReturnpageComponent,
    AddbookpageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    StorageServiceModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})


export class AppModule { }