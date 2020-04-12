import { Component, OnInit } from '@angular/core';
import { FlaskapiService } from "../flaskapi.service";
import { Subscription } from 'rxjs';
import { Inject } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Router } from "@angular/router";


@Component({
  selector: 'app-advicepage',
  templateUrl: './advicepage.component.html',
  styleUrls: ['./advicepage.component.css']
})


export class AdvicepageComponent implements OnInit {

  // MEMBER ATTRIBUTES

  public data: any = []
  public posts: any[];
  public postsSubscription: Subscription;


  // AUTOMATIC

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private flaskApiService: FlaskapiService, private router: Router) { }

  ngOnInit(): void {
    this.getFromLocal("USER_ID")
    if (this.data["USER_ID"]) {
      console.log("VALID");
      this.getCustomPosts();
    }
    else {
      this.getPosts();
    }
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
  }


  // LOCAL STORAGE ACCESS

  saveInLocal(key, val): void {
    this.storage.set(key, val);
  }

  getFromLocal(key): void {
    this.data[key] = this.storage.get(key);
  }


  // MEMBER FUNCTIONS

  // get recommended books
  public getPosts() {
    this.postsSubscription = this.flaskApiService.getAdvice().subscribe(p => {
      this.posts = p['data'];
      console.log(this.posts);
    })
  }

  // get custom recommendations
  public getCustomPosts() {
    this.postsSubscription = this.flaskApiService.getCustomAdvice(this.data["USER_ID"]).subscribe(p => {
      this.posts = p['data'];
      console.log(this.posts);
    })
  }


}
