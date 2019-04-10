import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private apiPath = 'https://cors-anywhere.herokuapp.com/https://warm-plains-86572.herokuapp.com/users';
  constructor(private http: HttpClient) { }

   getAll(): Observable<User[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToUsers)
    );
  }

  getById(id: number): Observable<User> {
    const url = this.apiPath + '/user/' + id;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToUser)
    );
  }

  create(user: User): Observable<User> {
    return this.http.post(this.apiPath, user).pipe(
      catchError(this.handleError),
      map(() => user)
    );
  }

  update(user: User): Observable<User> {
    const url = this.apiPath + '/user/' + user._id;

    return this.http.put(url, user).pipe(
      catchError(this.handleError),
      map(() => user)
    );
  }

  delete(id: number): Observable<User> {
    const url = this.apiPath + '/user/' + id;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToUser)
    );
  }

  private jsonDataToUsers(jsonData: any[]): User[] {
    const users: User[] = [];
    jsonData.forEach(element => users.push(element as User));
    return users;
  }

  private jsonDataToUser(jsonData: any): User {
    return jsonData as User;
  }

  private handleError(error: any): Observable<any> {
    console.log('request error -> ', error);
    return throwError(error);
  }
}
