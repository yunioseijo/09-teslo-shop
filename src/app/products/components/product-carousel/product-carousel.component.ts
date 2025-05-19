import { AfterViewInit, Component, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
// import Swiper JS
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
// import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.component.html',
  styles: `
    .swiper {
      width: 100%;

    }
    `,
})
export class ProductCarouselComponent implements AfterViewInit, OnChanges {
  images = input.required<string[]>();
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');
  swiper: Swiper | undefined = undefined

  ngAfterViewInit(): void {
    this.swiperInit();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['images'].firstChange) return;

    if(!this.swiper) return;
    this.swiper.destroy();
    const paginationEl: HTMLDivElement =
      this.swiperDiv().nativeElement?.querySelector('.swiper-pagination');
    paginationEl.innerHTML = '';
    setTimeout(() => {
      this.swiperInit();
    }
    , 200);

  }

  swiperInit(){
    const element = this.swiperDiv().nativeElement;
    if (!element) return;
    console.log('element', element);
    console.log(this.images());
    this.swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      modules: [Navigation, Pagination],
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });

  }
}
