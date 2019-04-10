import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User, UserBlog } from '../../models/user/user';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // token subject
  private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  // User subject
  private userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  public user: Observable<User>;
  // Blog subject
  private blogSubject: BehaviorSubject<UserBlog> = new BehaviorSubject<UserBlog>(null);
  public blog: Observable<UserBlog>;


  constructor(private http: HttpClient, private router: Router, private apiService: ApiService) {
    // If user is authenticated, then store token and user subjects with their local storage values.
    if (this.isAuth) {
      // Update token subject data.
      this.tokenSubject.next(localStorage.getItem('token'));
      // Update user subject data.
      this.userSubject.next(new User(JSON.parse(localStorage.getItem('user'))));
      // Update blog subject data.
      this.blogSubject.next(new UserBlog(JSON.parse(localStorage.getItem('blog'))));
    }
    this.user = this.userSubject.asObservable();
    this.blog = this.blogSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  public get blogValue(): UserBlog {
    return this.blogSubject.value;
  }

  public get tokenValue(): string {
    return this.tokenSubject.value;
  }

  public get isAuth(): boolean {
    return !!localStorage.getItem('token');
  }

  public unAuth(): void {
    // Clear local storage.
    localStorage.clear();
    // Clear token subject value.
    this.tokenSubject.next(null);
    // Clear user subject value.
    this.userSubject.next(null);
    // Clear blog subject value.
    this.blogSubject.next(null);
    // Redirect user to login page.
    this.router.navigateByUrl('/login');
  }

  public changeBlog(blog: UserBlog): void {
    localStorage.setItem('blog', JSON.stringify(blog));
    this.blogSubject.next(blog);
    this.router.navigate(['/dash', 'posts']);
  }

  login(payload: { username: string, password: string }): Observable<string> {
    return this.http.post(this.apiService.baseApi + 'account/login/', payload)
      .pipe(
        map((data: object): string => {
          // Store JWT into local storage.
          localStorage.setItem('token', data['token']);
          // Store user into local storage.
          localStorage.setItem('user', JSON.stringify(data['user']));
          // Store first blog into local storage.
          localStorage.setItem('blog', JSON.stringify(data['user'].sites[0]));
          // Update token subject data.
          this.tokenSubject.next(data['token']);
          // Update user subject data.
          this.userSubject.next(new User(data['user']));
          // Update blog subject data.
          this.blogSubject.next(this.userValue.sites[0]);
          // Return raw user data.
          return data['user'].username;
        }),
        catchError(this.apiService.handleError)
      );
  }
}
