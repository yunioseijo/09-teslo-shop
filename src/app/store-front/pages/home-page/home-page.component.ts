import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { ProductCardComponent } from '@store-front/components/store-front-card/product-card.component';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent,RouterLink],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  productsService = inject(ProductsService);

  productsResource = rxResource({
    request: () => ({}),
    loader: ({ request }) => {
      return this.productsService.getProducts({});
    },

  });
 }
