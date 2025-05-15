import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Product, ProductsResponse } from '@products/interfaces/product.interface';
import { Observable, of, tap } from 'rxjs';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({providedIn: 'root'})
export class ProductsService {
  private http = inject(HttpClient);
  private productsCache = new Map<string,ProductsResponse>();
  private productCache = new Map<string,Product>();


  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;
    const cacheKey = `${limit}-${offset}-${gender}`;
    if(this.productsCache.has(cacheKey)) {
      return of (this.productsCache.get(cacheKey)!);
    }
    return this.http.get<ProductsResponse>(`${baseUrl}/products`, {
        params: {
          limit: limit,
          offset: offset,
          gender: gender,
        }
      })
    .pipe(
      tap((response) => console.log(response)),
      tap((response) => this.productsCache.set(cacheKey, response))
    );

  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    const cacheKey = idSlug;
    if(this.productCache.has(cacheKey)) {
      return of (this.productCache.get(cacheKey)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${idSlug}`)
    .pipe(
      tap((response) => this.productCache.set(cacheKey, response)),
  );
  }
  getProductById(id: string): Observable<Product> {
    const cacheKey = id;
    if(this.productCache.has(cacheKey)) {
      return of (this.productCache.get(cacheKey)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${id}`)
    .pipe(
      tap((response) => this.productCache.set(cacheKey, response)),
  );
  }

}
