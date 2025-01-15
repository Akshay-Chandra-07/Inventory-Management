import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = sessionStorage.getItem('accesstoken')
    const refreshToken = sessionStorage.getItem('refreshtoken')
    if (req.url.includes('s3.ap-south-1.amazonaws.com')) {
      console.log("Intercepting S3 request and removing Authorization header");
      const modifiedReq = req.clone({ headers: req.headers.delete('Authorization') });
      return next.handle(modifiedReq);
    }
    const newReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
        Refresh : `${refreshToken}`
      },
    });
    return next.handle(newReq).pipe(tap({
      next:(event:HttpEvent<any>)=>{
        if(event instanceof HttpResponse){
          const newToken = event.headers.get('Authorization');
          if(newToken){
            sessionStorage.setItem('accesstoken',newToken)
          }
        }
      }
    }));
  }
}
