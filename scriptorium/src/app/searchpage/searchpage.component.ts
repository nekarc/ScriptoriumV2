import { Component, OnInit } from '@angular/core';
import { FlaskapiService } from "../flaskapi.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-searchpage',
  templateUrl: './searchpage.component.html',
  styleUrls: ['./searchpage.component.css']
})


export class SearchpageComponent implements OnInit {

  // MEMBER ATTRIBUTES

  public data: any;
  public postSubscription: Subscription;
  public currentId: any = this.route.snapshot.paramMap.get("id");
  public posts: any;
  public postsKey: any;
  public userEntry: any;


  // AUTOMATIC

  constructor(private flaskApiService: FlaskapiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
  }


  // MEMBER FUNCTIONS

  public onKeyUp(event: KeyboardEvent) {
    this.userEntry = (event.target as HTMLInputElement).value
    console.log(this.userEntry);
    if (this.userEntry) {
      this.postSubscription = this.flaskApiService.searchBooks(this.userEntry).subscribe(res => {
        this.posts = res["data"];
        for (let i = 0; i < this.posts.length; i++) {
          const element = this.posts[i];
          this.posts[i][6] = "exampleAccordion".concat(element[0].toString())
          this.posts[i][7] = "#exampleAccordion".concat(element[0].toString())
          this.posts[i][8] = "/book/".concat(element[0].toString())
        }
        console.log(this.posts);
        this.postSubscription.unsubscribe();
      })
    }
  }

  public onKeyUpKeyword(event: KeyboardEvent) {
    this.userEntry = (event.target as HTMLInputElement).value
    console.log(this.userEntry);
    if (this.userEntry) {
      this.postSubscription = this.flaskApiService.searchKey(this.userEntry).subscribe(res => {
        this.postsKey = res["data"];
        for (let i = 0; i < this.postsKey.length; i++) {
          const element = this.postsKey[i];
          this.postsKey[i][6] = "keyExampleAccordion".concat(element[0].toString())
          this.postsKey[i][7] = "#keyExampleAccordion".concat(element[0].toString())
          this.postsKey[i][8] = "/book/".concat(element[0].toString())
        }
        console.log(this.postsKey);
        this.postSubscription.unsubscribe();
      })
    }
  }


}
