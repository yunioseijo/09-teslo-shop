import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { ProductCardComponent } from '@store-front/components/store-front-card/product-card.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent,RouterLink, PaginationComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  productsService = inject(ProductsService);
  activatedRoute = inject(ActivatedRoute);

  currentPage = toSignal(this.activatedRoute.queryParams.pipe(
    map( ({page}) => page ? +page : 1),
    map((page) => isNaN(page) ? 1 : page) ),
     {initialValue: 1}
    );


  productsResource = rxResource({
    request: () => ({page: this.currentPage() - 1}),
    loader: ({ request }) => {
      return this.productsService.getProducts({offset: request.page*9});
    },

  });
 }
