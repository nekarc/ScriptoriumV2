import { Component, OnInit, OnDestroy } from '@angular/core';
import { Inject } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { FlaskapiService } from "../flaskapi.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { User } from "../models/User";
import { FormGroup } from "@angular/forms";


@Component({
  selector: 'app-bookpage',
  templateUrl: './bookpage.component.html',
  styleUrls: ['./bookpage.component.css']
})


export class BookpageComponent implements OnInit, OnDestroy {

  // MEMBER ATTRIBUTES

  public data: any = []
  public postSubscription: Subscription;
  public currentId: any = this.route.snapshot.paramMap.get("id");
  public post: any;
  public image: any;
  public busy: boolean;


  // AUTOMATIC

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private flaskApiService: FlaskapiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getPostById();
  }

  ngOnDestroy() {
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

  public getPostById() {
    this.postSubscription = this.flaskApiService.getBook(this.currentId).subscribe(res => {
      this.post = res["data"];
      console.log(this.post);
    })
  }

  public borrowBook(formData: User) {
    this.getFromLocal("USER_ID")
    if (this.data["USER_ID"]) {
      console.log("VALID");
      this.borrowRequest();
    }
    else {
      this.router.navigate(["/login"]);
    }
  }

  public borrowRequest() {
    this.postSubscription = this.flaskApiService.borrowBook(this.currentId, this.data["USER_ID"]).subscribe(res => {
      this.post = res["data"];
    })
    this.router.navigate(["/profile"]);
  }


}
