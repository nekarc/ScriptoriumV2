import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomepageComponent } from './homepage/homepage.component';
import { AdvicepageComponent } from './advicepage/advicepage.component';
import { SearchpageComponent } from './searchpage/searchpage.component';
import { BookpageComponent } from './bookpage/bookpage.component';
import { ProfilepageComponent } from './profilepage/profilepage.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { SignuppageComponent } from './signuppage/signuppage.component';
import { BorrowpageComponent } from './borrowpage/borrowpage.component';
import { RenewpageComponent } from './renewpage/renewpage.component';
import { ReturnpageComponent } from './returnpage/returnpage.component';
import { AddbookpageComponent } from './addbookpage/addbookpage.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent },
  { path: 'advice', component: AdvicepageComponent },
  { path: 'search', component: SearchpageComponent },
  { path: 'book/:id', component: BookpageComponent },
  { path: 'profile', component: ProfilepageComponent },
  { path: 'login', component: LoginpageComponent },
  { path: 'signup', component: SignuppageComponent },
  { path: 'borrow', component: BorrowpageComponent },
  { path: 'renew/:id', component: RenewpageComponent },
  { path: 'return/:id', component: ReturnpageComponent },
  { path: 'addbook', component: AddbookpageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: "enabled"})],
  exports: [RouterModule]
})

export class AppRoutingModule { }
