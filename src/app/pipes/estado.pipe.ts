import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estado'
})
export class EstadoPipe implements PipeTransform {

  transform(estado: boolean): string {
    if (estado === true) {
      return 'Habilitado';
    } else {
      return 'Deshabilitado';
    }
  }

}
