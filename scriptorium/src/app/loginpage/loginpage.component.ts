import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FlaskapiService } from "../flaskapi.service";
import { Router } from "@angular/router";
import { User } from "../models/User";


@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})


export class LoginpageComponent implements OnInit {

  // MEMBER ATTRIBUTES

  public data: any = []
  public busy: boolean;


  // AUTOMATIC
  
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private flaskApiService: FlaskapiService, private router: Router) { }

  ngOnInit(): void {
    this.getFromLocal("USER_ID")
    if (this.data["USER_ID"]) {
      this.router.navigate(["/profile"]);
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
    uid: new FormControl('', Validators.required),
    pwd: new FormControl('', Validators.required),
  });


  // MEMBER FUNCTIONS
  
  public logIn(formData: User) {
    this.busy = true;
    this.flaskApiService.logIn(formData).subscribe(res => {
      this.busy = false;
      console.log(res);
      if (res["data"] == "Invalid") {
        this.router.navigate(["/login"]);
      }
      else {
        this.saveInLocal("USER_ID", res["data"]);
        this.router.navigate(["/profile"]);
      }


    });
  }


}
