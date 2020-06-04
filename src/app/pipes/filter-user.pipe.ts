import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUser'
})
export class FilterUserPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultFilter = [];
    for (const Empleados of value) {
      if (Empleados.name.indexOf(arg) > -1) {
        resultFilter.push(Empleados);
      }
    }
    return resultFilter;
  }

}
