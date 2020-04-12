import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { FlaskapiService } from "../flaskapi.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-returnpage',
  templateUrl: './returnpage.component.html',
  styleUrls: ['./returnpage.component.css']
})


export class ReturnpageComponent implements OnInit {

  // MEMBER ATTRIBUTES

  public data: any = []
  public postSubscription: Subscription;
  public currentId: any = this.route.snapshot.paramMap.get("id");
  public post: any;


  // AUTOMATIC

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private flaskApiService: FlaskapiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getFromLocal("USER_ID")
    if (this.data["USER_ID"]) {
      console.log("VALID");
      this.returnBook();
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


  // MEMBER FUNCTIONS

  returnBook() {
    this.postSubscription = this.flaskApiService.returnBook(this.currentId, this.data["USER_ID"]).subscribe(res => {
      this.post = res["data"];
    })
  }


}
