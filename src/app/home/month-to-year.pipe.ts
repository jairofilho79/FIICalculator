import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthToYear'
})
export class MonthToYearPipe implements PipeTransform {

  transform(value: number): any {
    const months = value % 12
    return `${(value-months)/12} anos  e ${months} meses`;
  }

}
