import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { ProductCardComponent } from '@store-front/components/store-front-card/product-card.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent,RouterLink, PaginationComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);



  productsResource = rxResource({
    request: () => ({page: this.paginationService.currentPage() - 1}),
    loader: ({ request }) => {
      return this.productsService.getProducts({offset: request.page*9});
    },

  });
 }
