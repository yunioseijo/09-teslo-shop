import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { ProductCardComponent } from '@store-front/components/store-front-card/product-card.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent,RouterLink],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {
  activatedRoute = inject(ActivatedRoute);
  productsService = inject(ProductsService);

  gender = toSignal(this.activatedRoute.params.pipe(
    map( ({gender}) => gender)
  ));

  productsResource = rxResource({
    request: () => ({gender: this.gender()}),
    loader: ({ request }) => {
      return this.productsService.getProducts({gender: request.gender});
    },

  });
 }
