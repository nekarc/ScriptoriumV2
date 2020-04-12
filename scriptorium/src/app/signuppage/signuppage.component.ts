import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FlaskapiService } from "../flaskapi.service";
import { Router } from "@angular/router";
import { User } from "../models/User";


@Component({
  selector: 'app-signuppage',
  templateUrl: './signuppage.component.html',
  styleUrls: ['./signuppage.component.css']
})


export class SignuppageComponent implements OnInit {

  // MEMBER ATTRIBUTES

  public image: any = null;
  public data: any = []
  public busy: boolean;


  // AUTOMATIC

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private flaskApiService: FlaskapiService, private router: Router) { }

  ngOnInit(): void {
  }


  // LOCAL STORAGE ACCESS

  saveInLocal(key, val): void {
    this.storage.set(key, val);
    this.router.navigate(["/profile"]);
  }

  getFromLocal(key): void {
    this.data[key] = this.storage.get(key);
  }


  // FORM STRUCTURE

  public postForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    pwd: new FormControl('', Validators.required),
  });


  // MEMBER FUNCTIONS

  public signUp(formData: User) {
    this.busy = true;
    this.flaskApiService.signUp(formData).subscribe(res => {
      this.busy = false;
      console.log(res);
      this.saveInLocal("USER_ID", res["data"]);
    });
  }


}
