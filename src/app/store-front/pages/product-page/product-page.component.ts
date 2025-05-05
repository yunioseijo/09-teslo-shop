import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import { ProductsService } from '@products/services/products.service';

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {
  activatedRoute = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  productIdSlug = this.activatedRoute.snapshot.paramMap.get('idSlug') ?? '';
  // productResource = rxResource({
  //   request: () => ({}),
  //   loader: ({ request }) => {
  //     return this.productsService.getProductByIdSlug(this.productIdSlug);
  //   },
  // });
  productResource = rxResource({
    request: () => ({idSlug: this.productIdSlug}),
    loader: ({ request }) => this.productsService.getProductByIdSlug(request.idSlug),
  });


}
