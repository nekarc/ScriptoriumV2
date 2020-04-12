import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";

import { User } from "./models/User";
import { Book } from "./models/Book";

@Injectable({
  providedIn: 'root'
})

export class FlaskapiService {

  constructor(private httpClient: HttpClient) { }

  public server:string = "http://localhost:5000/api/";

  public signUp(postObj: User) {
    const { name, email, pwd} = postObj;
    const sendData: FormData = new FormData();
    sendData.append("name", name);
    sendData.append("email", email);
    sendData.append("pwd", pwd);
    return this.httpClient.post<User>(this.server+"adduser", sendData);
  }

  public addBook(postObj: Book, image: any) {
    const { title, author, genre, desc} = postObj;
    const sendData: FormData = new FormData();
    sendData.append("title", title);
    sendData.append("author", author);
    sendData.append("genre", genre);
    sendData.append("desc", desc);
    sendData.append("cover", image[0], image["filename"]);
    console.log(sendData);
    return this.httpClient.post<Book>(this.server+"addbook", sendData)
  }

  public getAdvice() {
    return this.httpClient.get<Book>(this.server + "reccs");
  }

  
  public getBook(bookId: string) {
    return this.httpClient.get<Book>(this.server + `book/${bookId}`);
  }

  public logIn(postObj: User) {
    const { uid, pwd} = postObj;
    const sendData: FormData = new FormData();
    sendData.append("uid", uid);
    sendData.append("pwd", pwd);
    return this.httpClient.post<User>(this.server+"validateuser", sendData);
  }

  public getUserDetails(userId: string) {
    return this.httpClient.get<Book>(this.server + `user/${userId}`);
  }

  public borrowBook(bookId: string, userId: string) {
    return this.httpClient.get<Book>(this.server + `borrow/${bookId}` + `/${userId}`);
  }

  public getCustomAdvice(userId: string) {
    return this.httpClient.get<Book>(this.server + `customreccs/${userId}`);
  }
  
  public returnBook(bookId: string, userId: string) {
    return this.httpClient.get<Book>(this.server + `return/${bookId}` + `/${userId}`);
  }
  
  public renewBook(bookId: string, userId: string) {
    return this.httpClient.get<Book>(this.server + `renew/${bookId}` + `/${userId}`);
  }

  public searchBooks(userEntry: string) {
    return this.httpClient.get<Book>(this.server + `searchBooks/${userEntry}`);
  }

  public searchKey(userEntry: string) {
    return this.httpClient.get<Book>(this.server + `searchKey/${userEntry}`);
  }

}
