import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import { environment } from '@environments/environment';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';
import { Observable, of, tap } from 'rxjs';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Kid,
  tags: [],
  images: [],
  user: {} as User
}

@Injectable({ providedIn: 'root' })
export class ProductsService {

  private http = inject(HttpClient);
  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;
    const cacheKey = `${limit}-${offset}-${gender}`;
    if (this.productsCache.has(cacheKey)) {
      return of(this.productsCache.get(cacheKey)!);
    }
    return this.http
      .get<ProductsResponse>(`${baseUrl}/products`, {
        params: {
          limit: limit,
          offset: offset,
          gender: gender,
        },
      })
      .pipe(
        tap((response) => console.log(response)),
        tap((response) => this.productsCache.set(cacheKey, response))
      );
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    const cacheKey = idSlug;
    if (this.productCache.has(cacheKey)) {
      return of(this.productCache.get(cacheKey)!);
    }
    return this.http
      .get<Product>(`${baseUrl}/products/${idSlug}`)
      .pipe(tap((response) => this.productCache.set(cacheKey, response)));
  }
  getProductById(id: string): Observable<Product> {
    if(id === 'new') {
      return of(emptyProduct);
    }
    const cacheKey = id;
    if (this.productCache.has(cacheKey)) {
      return of(this.productCache.get(cacheKey)!);
    }
    return this.http
      .get<Product>(`${baseUrl}/products/${id}`)
      .pipe(tap((response) => this.productCache.set(cacheKey, response)));
  }

  updateProduct(
    id: string,
    productLike: Partial<Product>
  ): Observable<Product> {
    return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike)
      .pipe( tap((product) => this.updateProductCache(product, true)));
  }
  createProduct(productLike: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${baseUrl}/products`, productLike)
      .pipe( tap((product) => this.updateProductCache(product)));
  }

  updateProductCache(product: Product, updateCache = false) {
    const productId = product.id;
    this.productCache.set(productId, product);

    if(!updateCache) return;
    // Update the products cache
    this.productsCache.forEach((productsResponse) => {
      productsResponse.products = productsResponse.products.map(
        (currentProduct) => currentProduct.id === productId ? product : currentProduct
      );
    });
  }


}
