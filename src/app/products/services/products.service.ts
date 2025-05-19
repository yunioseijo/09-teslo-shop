import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import { environment } from '@environments/environment';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';

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
        tap((response) => this.productsCache.set(cacheKey, response))
      );
  }

/**
 * Retrieves a product by its ID slug.
 * @param idSlug - The slug of the product to retrieve.
 * @returns An observable containing the product.
 * If the product is already in the cache, the cached product is returned.
 * Otherwise, a request is made to the server to retrieve the product, and the response is cached.
 */

  getProductByIdSlug(idSlug: string): Observable<Product> {
    const cacheKey = idSlug;
    if (this.productCache.has(cacheKey)) {
      return of(this.productCache.get(cacheKey)!);
    }
    return this.http
      .get<Product>(`${baseUrl}/products/${idSlug}`)
      .pipe(tap((response) => this.productCache.set(cacheKey, response)));
  }
  /**
   * Gets a product by id
   * @param id the id of the product
   * @returns The product
   * If the id is 'new', it returns an empty product
   * If the product is already in the cache, it returns it
   * Otherwise, it makes a request to the server and caches the response
   */
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


  /**
   * Update a product
   * @param id the id of the product to update
   * @param productLike the partial product with the updated values
   * @param imageFileList the list of image files to upload
   * @returns The updated product
   */

  updateProduct(
    id: string,
    productLike: Partial<Product>,
    imageFileList?: FileList
  ): Observable<Product> {
    const currentImages = productLike.images ?? [];
    return this.uploadImages(imageFileList).pipe(
      map((imageNames) => ({
        ...productLike,
        images: [...currentImages, ...imageNames],
      })),
      switchMap( (updateProduct) =>
        this.http.patch<Product>(`${baseUrl}/products/${id}`, updateProduct)
    ),
      tap((product) => this.updateProductCache(product, true))

    );
  }
  /**
   * Creates a new product and saves it to the server
   * @param productLike A partial product with the values to save
   * @param imageFileList The list of image files to upload
   * @returns The created product
   */
  createProduct(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {
    const currentImages = productLike.images ?? [];
    return this.uploadImages(imageFileList).pipe(
      map((imageNames) => ({
        ...productLike,
        images: [...currentImages, ...imageNames],
      })),
      switchMap( (newProduct) => this.http.post<Product>(`${baseUrl}/products`, newProduct)),
      tap((product) => this.updateProductCache(product))
    );

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

  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);
    const formData = new FormData();
    const uploadObservables = Array.from(images).map((imageFile) =>
      this.uploadImage(imageFile)
    );
    return forkJoin(uploadObservables).pipe(
      // tap((imageNames) => console.log('fileNames', imageNames)),
    );
  }
  uploadImage(imageFile: File): Observable<string> {
    const formData  = new FormData();
    formData.append('file', imageFile);
    return this.http.post<{ fileName: string }>(`${baseUrl}/files/product`, formData)
    .pipe(map((resp) => resp.fileName));
  }


}
