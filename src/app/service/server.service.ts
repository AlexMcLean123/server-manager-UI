import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Status } from '../enum/status.enum';
import { CustomResponse } from '../interface/custom-response';
import { Server } from '../interface/server';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private apiUrl= 'http://localhost:8080';

  constructor(private http: HttpClient) { }



  //alot of ternuery statements here, if status all returns all response with spread(...), 
  ///then filters by status, if greater then 0 returns either up or down, if 0 returns not found
    filter$ = (status : Status, response: CustomResponse) => <Observable<CustomResponse>>
    new Observable<CustomResponse>(
      subscriber => {
        console.log(response);
        subscriber.next(
          status === Status.ALL ? { ... response, message: `Servers Filtered by ${status} status`} :
           { ... response, message: response.data.servers.filter(server => server.status === status).length > 0
             ?`Servers filtered by ${status === Status.SERVER_UP ? 'SERVER_UP' : 'SERVER_DOWN' } status` : `No Servers of ${status} found`, 
             data: { servers: response.data.servers.filter(server => server.status === status)}
          }
        );
        subscriber.complete();
      }
    )
    

    servers$ = <Observable<CustomResponse>>this.http.get<CustomResponse>(`${this.apiUrl}/server/list`)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    );

    save$ = (server: Server) => <Observable<CustomResponse>>this.http.post<CustomResponse>(`${this.apiUrl}/server/save`, server)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    );

    ping$ = (ipAddress: string) => <Observable<CustomResponse>>this.http.get<CustomResponse>(`${this.apiUrl}/server/ping/${ipAddress}`)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    );

    delete$ = (serverId: number) => <Observable<CustomResponse>>this.http.delete<CustomResponse>(`${this.apiUrl}/server/ping/${serverId}`)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    );


    private handleError(error: HttpErrorResponse): Observable<never> {
      console.log(error);
      return throwError(`An Error occured - Error Code: ${error.status}`);
    }
  
}

