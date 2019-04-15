import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../api/api.service';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApiResponseService } from '../api-response/api-response.service';

@Injectable({
  providedIn: 'root'
})
export class BaseModelService<T> {

  public modelClass;

  constructor(private http: HttpClient, private apiService: ApiService) {
  }

  /**
   * Make a query to return all the objects from the model API endpoint.
   */
  get(endpoint: string, params?: { [key: string]: string }): Observable<ApiResponseService<T>> {
    const httpParams: HttpParams = new HttpParams({ fromObject: params });

    // API call
    return this.http.get<ApiResponseService<T>>(this.apiService.baseApi + endpoint, { params: httpParams })
      .pipe(
        map((data: ApiResponseService<T>): ApiResponseService<T> => {
          const results: Array<T> = [];

          data.results.map((modelData: any): void => {
            results.push(new this.modelClass(modelData));
          });

          return new ApiResponseService(data.count, data.next, data.previous, results);
        }),
        catchError(this.apiService.handleError)
      );
  }

  /**
   * Get a single object from backend.
   */
  detail(endpoint: string, params?: { [key: string]: string }): Observable<T> {
    const httpParams: HttpParams = new HttpParams({ fromObject: params });
    // API call
    return this.http.get<T>(this.apiService.baseApi + endpoint, { params: httpParams })
      .pipe(
        map((data: { [key: string]: any }): T => {
          return new this.modelClass(data);
        }),
        catchError(this.apiService.handleError)
      );
  }

  /**
   * Make an API call to update.
   */
  put(endpoint: string, body: T): Observable<T> {
    // API call
    return this.http.put<T>(this.apiService.baseApi + endpoint, body)
      .pipe(
        map((data: { [key: string]: any }): T => {
          return new this.modelClass(data);
        }),
        catchError(this.apiService.handleError)
      );
  }

  /**
   * Make an API call to delete an object from an endpoint.
   */
  remove(endpoint: string): Observable<any> {
    // API call
    return this.http.delete<any>(this.apiService.baseApi + endpoint)
      .pipe(
        catchError(this.apiService.handleError)
      );
  }

  /**
   * Make an API call to get next and previous.
   */
  paginate(url: string): Observable<ApiResponseService<T>> {
    // API call
    return this.http.get<ApiResponseService<T>>(url)
      .pipe(
        map((data: ApiResponseService<T>): ApiResponseService<T> => {
          const results: Array<T> = [];

          data.results.map((modelData: any): void => {
            results.push(new this.modelClass(modelData));
          });

          return new ApiResponseService(data.count, data.next, data.previous, results);
        }),
        catchError(this.apiService.handleError)
      );
  }
}
