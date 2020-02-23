import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dinheiro'
})
export class DinheiroPipe implements PipeTransform {

  transform(value: string | number, ): string {
    const dinheiro = String(value);
    const inteiro = dinheiro.split(".")[0];
    const decimal = dinheiro.split(".")[1] ? ","+dinheiro.split(".")[1]+"000" : ",00";

    if(inteiro.length < 4) return "R$ "+inteiro + decimal.substr(0, 3);
    return "R$ "+inteiro.split('').reverse().join('').match(/.{1,3}/g).join('.').split('').reverse().join('') + decimal.substr(0, 3);
  }

}
