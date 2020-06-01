import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'referencia'
})
export class ReferenciaPipe implements PipeTransform {

  transform(value: string): string {
    if (value === undefined || value === null) {
      return value;
    }
    if ((value[0].toUpperCase() == 'U' || value[0].toUpperCase() == 'N')) {
      return value.substr(1);
    }
    return value;
  }

}
