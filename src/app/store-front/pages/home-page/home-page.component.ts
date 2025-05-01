import { Component } from '@angular/core';
import { ProductCardComponent } from "../../components/store-front-card/product-card.component";

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent { }
