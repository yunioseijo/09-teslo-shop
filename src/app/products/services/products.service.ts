import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Product, ProductsResponse } from '@products/interfaces/product.interface';
import { Observable, tap } from 'rxjs';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({providedIn: 'root'})
export class ProductsService {
  private http = inject(HttpClient);


  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;
    return this.http.get<ProductsResponse>(`${baseUrl}/products`, {
        params: {
          limit: limit,
          offset: offset,
          gender: gender,
        }
      })
    .pipe( tap((response) => console.log({response})) );
  }

}
