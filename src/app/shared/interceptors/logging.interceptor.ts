import { HttpRequest, HttpHandlerFn, HttpEvent, HttpEventType } from "@angular/common/http";
import { Observable, tap } from "rxjs";

// This interceptor logs the request URL and response status to the console.
// It can be used for debugging purposes to track the requests made by the application.
export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  return next(req).pipe(tap (event => {
    if (event.type === HttpEventType.Response) {
      // console.log(req.url, 'returned a response with status', event.status);
    }
  }));
}
