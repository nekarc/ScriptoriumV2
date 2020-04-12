import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { FormGroup } from "@angular/forms";
import { FlaskapiService } from "../flaskapi.service";
import { Router } from "@angular/router";
import { User } from "../models/User";
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-profilepage',
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.css']
})


export class ProfilepageComponent implements OnInit {

  // MEMBER ATTRIBUTES

  public data: any = [];
  public postSubscription: Subscription;
  public post: any;
  public titles: any;
  public renew_term: any;
  public renew_link: any;
  public return_term: any;
  public return_link: any;
  public images: any;
  public busy: boolean;


  // AUTOMATIC

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private flaskApiService: FlaskapiService, private router: Router) { }

  ngOnInit(): void {
    this.getFromLocal("USER_ID")
    if (this.data["USER_ID"]) {
      console.log("VALID");
      this.getUserDetails();
    }
    else {
      this.router.navigate(["/login"]);
    }
  }


  // LOCAL STORAGE ACCESS

  saveInLocal(key, val): void {
    this.storage.set(key, val);
  }

  getFromLocal(key): void {
    this.data[key] = this.storage.get(key);
  }


  // FORM STRUCTURE

  public postForm = new FormGroup({
  });


  // MEMBER FUNCTIONS

  getUserDetails() {
    this.postSubscription = this.flaskApiService.getUserDetails(this.data["USER_ID"]).subscribe(res => {
      this.post = res["data"];
      if (!res["data"]) {
        this.post = new Object();
        this.post[0] = this.data["USER_ID"];

        this.titles = new Object();
        this.titles[0] = "-";
        this.titles[1] = "-";
        this.titles[2] = "-";

        this.renew_term = new Object();
        this.renew_term[0] = "-";
        this.renew_term[1] = "-";
        this.renew_term[2] = "-";

        this.renew_link = new Object();
        this.renew_link[0] = "/profile";
        this.renew_link[1] = "/profile";
        this.renew_link[2] = "/profile";

        this.return_term = new Object();
        this.return_term[0] = "-";
        this.return_term[1] = "-";
        this.return_term[2] = "-";

        this.return_link = new Object();
        this.return_link[0] = "/profile";
        this.return_link[1] = "/profile";
        this.return_link[2] = "/profile";

        this.images = new Object();
        this.images[0] = "assets/images/square_img_5.jpg";
        this.images[1] = "assets/images/square_img_5.jpg";
        this.images[2] = "assets/images/square_img_5.jpg";
      }
      else {
        this.post[0] = this.data["USER_ID"];

        this.titles = new Object();
        this.titles[0] = (this.post[1]) ? (this.post[1]) : "-";
        this.titles[1] = (this.post[3]) ? (this.post[3]) : "-";
        this.titles[2] = (this.post[5]) ? (this.post[5]) : "-";

        this.renew_term = new Object();
        this.renew_term[0] = (this.post[1]) ? "Renew" : "-";
        this.renew_term[1] = (this.post[3]) ? "Renew" : "-";
        this.renew_term[2] = (this.post[5]) ? "Renew" : "-";

        this.renew_link = new Object();
        this.renew_link[0] = (this.post[1]) ? "/renew/" + this.post[10] : "/profile";
        this.renew_link[1] = (this.post[3]) ? "/renew/" + this.post[11] : "/profile";
        this.renew_link[2] = (this.post[5]) ? "/renew/" + this.post[12] : "/profile";

        this.return_term = new Object();
        this.return_term[0] = (this.post[1]) ? "Return" : "-";
        this.return_term[1] = (this.post[3]) ? "Return" : "-";
        this.return_term[2] = (this.post[5]) ? "Return" : "-";

        this.return_link = new Object();
        this.return_link[0] = (this.post[1]) ? "/return/" + this.post[10] : "/profile";
        this.return_link[1] = (this.post[3]) ? "/return/" + this.post[11] : "/profile";
        this.return_link[2] = (this.post[5]) ? "/return/" + this.post[12] : "/profile";

        this.images = new Object();
        this.images[0] = (this.post[1]) ? (this.post[7]) : "assets/images/square_img_5.jpg";
        this.images[1] = (this.post[3]) ? (this.post[8]) : "assets/images/square_img_5.jpg";
        this.images[2] = (this.post[5]) ? (this.post[9]) : "assets/images/square_img_5.jpg";

      }
      console.log(this.post);
      console.log(this.titles);
      console.log(this.renew_term);
      console.log(this.renew_link);
      console.log(this.return_term);
      console.log(this.return_link);
      console.log(this.images);
    })
  }

  public logOut(formData: User) {
    this.storage.clear();
    this.router.navigate(["/login"]);
  }


}
