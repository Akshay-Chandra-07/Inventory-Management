import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpEventType,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const accessToken = sessionStorage.getItem('accesstoken');
    if (req.url.includes('s3.ap-south-1.amazonaws.com')) {
      return next.handle(req);
    }
    const newReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return next.handle(newReq).pipe(
      tap({
        next: (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.Response) {
            const newToken =
              event.headers.get('Authorization') ||
              event.headers.get('authorization');
            if (newToken) {
              console.log('New token recieved');
              sessionStorage.setItem('accesstoken', newToken);
            }
          }
        },
      }),
    );
  }
}
