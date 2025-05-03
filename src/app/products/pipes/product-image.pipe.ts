import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '@environments/environment';

const baseUrl = environment.baseUrl

@Pipe({
  name: 'productImage'
})

export class ProductImagePipe implements PipeTransform {
  transform(value: string |string [], ...args: any[]): any {
    // array > 1 = primer elemento
    //string = string
    // placeholder image: ./assets/images/no-image.jpg
    if (typeof value === 'string') {
      return `${baseUrl}/files/product/${value}`;
    }
    const image = value[0];
    if(!image) {
      return './assets/images/no-image.jpg';
    }
    return `${baseUrl}/files/product/${image}`;


  }
}
