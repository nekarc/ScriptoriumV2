import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FlaskapiService } from "../flaskapi.service";
import { Router } from "@angular/router";
import { Book } from "../models/Book";


@Component({
  selector: 'app-addbookpage',
  templateUrl: './addbookpage.component.html',
  styleUrls: ['./addbookpage.component.css']
})


export class AddbookpageComponent implements OnInit {

  // MEMBER ATTRIBUTES

  public image: any = null;
  public busy: boolean;


  // AUTOMATIC

  constructor(private flaskApiService: FlaskapiService, private router: Router) { }
  
  ngOnInit(): void {
  }


  // FORM STRUCTURE

  public postForm = new FormGroup({
    title: new FormControl('', Validators.required),
    author: new FormControl('', Validators.required),
    genre: new FormControl('', Validators.required),
    desc: new FormControl('', Validators.required),
    cover: new FormControl('', Validators.required),
  });


  // MEMBER FUNCTIONS

  // file upload
  public handleInput($event: Event) {
    this.image = $event.target["files"];
    console.log(this.image);
  }

  // submit book details to add to the DB
  public addBook(formData: Book) {
    this.busy = true;
    this.flaskApiService.addBook(formData, this.image).subscribe(res => {
      this.busy = false;
      console.log(res);
      this.router.navigate(["/profile"]);
    });
  }

  
}
