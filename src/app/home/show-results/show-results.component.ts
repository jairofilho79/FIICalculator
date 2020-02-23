import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Rendimento } from '../Rendimento';

@Component({
  selector: 'app-show-results',
  templateUrl: './show-results.component.html',
  styleUrls: ['./show-results.component.css']
})
export class ShowResultsComponent implements OnInit {

  @Input() rendimentos: Rendimento[];
  @Input() form;
  @Output() novaSimulacaoEvent = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }

  novaSimulacao() {
    this.novaSimulacaoEvent.emit()
  }

  totalCotasCompradasComRendimentos() {
    return this.rendimentos.reduce((total, item) => total + item.cotasCompradasComRendimentos, 0)
  }

  totalPago() {
    return this.rendimentos[this.rendimentos.length - 1].cotasAcumuladas * this.form.valorCota;
  }

  totalRecebido() {
    return this.totalCotasCompradasComRendimentos() * this.form.valorCota + this.rendimentos[this.rendimentos.length - 1].acumulado;
  }

  getSalario() {
    return this.form.rendimentoCota * this.rendimentos[this.rendimentos.length - 1].cotasAcumuladas
  }

  getMontante() {
    return this.rendimentos[this.rendimentos.length - 1].acumulado;
  }

  recebidoSuperaPago() {
    const recebido = this.totalRecebido();
    const pago = this.totalPago();
    const salario = this.getSalario();

    return Math.ceil((pago - recebido)/salario);
  }

  getBalanco(index) {
    const rendimento = this.rendimentos[index];
    return rendimento.acumulado - rendimento.gastoAcumulado;
  }

}
