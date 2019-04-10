import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token: string;
    // Get token from token subject.
    token = localStorage.getItem('token');
    // Add authorization header with bearer token if available.
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `JWT ${token}`
        }
      });
    }

    return next.handle(request).pipe(catchError((error: HttpErrorResponse): Observable<never> => {
      // Auto logout if 401 response returned from api
      if (error.status === 401) {
        this.authService.unAuth();
      }
      return throwError(error);
    }));
  }
}
