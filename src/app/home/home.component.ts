import { Component, OnInit } from '@angular/core';
import { Rendimento } from './Rendimento';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  rendimentos = <Rendimento[]> [];
  calculadoraFIIForm: FormGroup
  condicionais = [];
  cotasCompradasNesseMes = {}

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.calculadoraFIIForm = this.formBuilder.group({
      valorCota: ['100', Validators.required],
      rendimentoCota: ['0.5', Validators.required],
      cotasCompradasPorMes: ['10', Validators.required],
      mesInicial: ['2020-02', Validators.required],
      mesProjecao: ['2023-03'],
      cotaAtual: ['30', Validators.required],
      comprarCotaComRendimentos: [true],
      tipoCompraCotaComRendimentos : ['acumulado', Validators.required],
      criterioParada: ['salario', Validators.required],
      salario: ['100'],
      montante: ['1000'],
      condicionalMes: ['1'],
      condicionalNumeroCotas: ['30']
    })
  }

  getFormValues() {
    const formValues = this.calculadoraFIIForm.getRawValue();
    const {
      criterioParada,
      comprarCotaComRendimentos,
      tipoCompraCotaComRendimentos
    } = formValues
    const [anoProj, mesProj] = formValues.mesProjecao.split('-');
    const [anoIni, mesIni] = formValues.mesInicial.split('-')
    let values = {
      'valorCota' : parseFloat(formValues.valorCota),
      'rendimentoCota': parseFloat(formValues.rendimentoCota),
      'cotasCompradasPorMes': parseInt(formValues.cotasCompradasPorMes, 10),
      'mesInicial': new Date(Date.UTC(anoIni, mesIni)),
      'mesProjecao': new Date(Date.UTC(anoProj, mesProj)),
      'cotaAtual': parseInt(formValues.cotaAtual, 10),
      comprarCotaComRendimentos,
      tipoCompraCotaComRendimentos,
      criterioParada,
      salario: parseFloat(formValues.salario),
      montante: parseFloat(formValues.montante),
      'condicionalMes': parseInt(formValues.condicionalMes, 10),
      'condicionalNumeroCotas': parseInt(formValues.condicionalNumeroCotas, 10)
    }

    return values;
  }

  getCriterioParada(criterioParada) {
    switch(criterioParada) {
      case "salario":
        return `formValues.salario > formValues.rendimentoCota*this.rendimentos[this.rendimentos.length - 1].cotasAcumuladas`
        case "determinadoMesAno":
          return `mesAtual <= mesesTotal`
          case "montante":
            return `formValues.montante > this.rendimentos[this.rendimentos.length - 1].acumulado`
    }
  }

  setCondicoesDeCompra() {
    const { cotasCompradasPorMes } = this.getFormValues()
    this.cotasCompradasNesseMes = {}
    for(let condicional of this.condicionais) {
      this.cotasCompradasNesseMes[condicional.mes] = condicional.numeroCotas;
    }
    for(let i = 0; i < 12; i++) {
      if(this.cotasCompradasNesseMes[i] === undefined) {
        this.cotasCompradasNesseMes[i] = cotasCompradasPorMes;
      }
    }
  }

  calcularSimulacao() {
    const formValues = this.getFormValues()
    let totalCotas = formValues.cotaAtual;
    let mesAtual = 0
    const criterioParada = this.getCriterioParada(formValues.criterioParada);
    let mesesTotal;
    //Está sendo usando no eval()
    if(formValues.criterioParada === 'determinadoMesAno')
      mesesTotal = formValues.mesProjecao.getMonth() - formValues.mesInicial.getMonth() + (formValues.mesProjecao.getFullYear() - formValues.mesInicial.getFullYear())*12;

    this.rendimentos.push(
      <Rendimento>
      {
        'mesAno': '00/00',
        'cotasCompradas': 0,
        'cotasAcumuladas': formValues.cotaAtual,
        'gastoDoMes': 0,
        'gastoAcumulado': 0,
        'doMes': 0,
        'acumulado': 0,
        'cotasCompradasComRendimentos': 0
      })

    while(eval(criterioParada)) {
      totalCotas = this.rendimentos[this.rendimentos.length - 1].cotasAcumuladas;
      this.rendimentos.push(
        this.calcularInteracao(
          formValues,
          totalCotas,
          mesAtual
        )
      )
      mesAtual++;
    }

    this.rendimentos.shift()
    document.body.scrollTop = document.documentElement.scrollTop = 0;

  }

  calcularInteracao(formValues, totalCotas, mesAtual) {

    // TODO: Adicionar componente reutilizável para adições de Condições
      // if(mesDoAnoAtual === 2) cotasCompradasPorMes = 30;
      // else cotasCompradasPorMes = 10;

      // TODO: Se comprar cotas com rendimentos, perguntar se compra com rendimento do mês ou rendimento acumulado.
      this.setCondicoesDeCompra()
      const cotasCompradas = this.cotasCompradasNesseMes[(formValues.mesInicial.getMonth() + mesAtual) % 12];

      const ultimoRendimento = this.rendimentos[this.rendimentos.length -1]

      totalCotas += cotasCompradas;

      let cotasCompradasComRendimentos = 0;

      if(formValues.comprarCotaComRendimentos && ultimoRendimento.acumulado > 0) {
        switch(formValues.tipoCompraCotaComRendimentos) {
          case "doMes":
            cotasCompradasComRendimentos = Math.floor(totalCotas*formValues.rendimentoCota/formValues.valorCota)
            break;
          case "acumulado":
            if(this.rendimentos.length === 0) break;
            cotasCompradasComRendimentos = Math.floor(
              (
                ultimoRendimento.acumulado
                + totalCotas * formValues.rendimentoCota
              )
              / formValues.valorCota
            );
            break;
        }

        totalCotas += cotasCompradasComRendimentos;
      }

      const rendimentoDoMes = totalCotas * formValues.rendimentoCota - cotasCompradasComRendimentos * formValues.valorCota;
      const gastoDoMes = (cotasCompradasComRendimentos + cotasCompradas) * formValues.valorCota;
      const mesDoAnoAtual = (formValues.mesInicial.getMonth() + mesAtual) % 12 + 1;

      return <Rendimento>
      {
        'mesAno':
          `${ mesDoAnoAtual < 10 ? "0" : ""}${mesDoAnoAtual}/${formValues.mesInicial.getFullYear() + Math.floor((mesAtual+1)/12)}`,
        cotasCompradas,
        'cotasAcumuladas': totalCotas,
        gastoDoMes,
        'gastoAcumulado': this.rendimentos.length > 0 ? ultimoRendimento.gastoAcumulado + gastoDoMes : gastoDoMes,
        'doMes': rendimentoDoMes,
        'acumulado': this.rendimentos.length > 0 ? ultimoRendimento.acumulado + rendimentoDoMes : rendimentoDoMes,
        cotasCompradasComRendimentos
      }
  }

  novaSimulacao() {
    this.rendimentos.length = 0;
  }

  limparFormulario() {
    this.calculadoraFIIForm.reset();
    this.condicionais.length = 0;
  }

  adicionarCondicional() {
    const {condicionalMes, condicionalNumeroCotas} = this.getFormValues()
    this.removerCondicional(condicionalMes);
    this.condicionais.push({mes: condicionalMes, numeroCotas: condicionalNumeroCotas})
  }

  removerCondicional(condicionalMes) {

    const index = this.condicionais.findIndex(item => item.mes === condicionalMes);
    index !==-1 && this.condicionais.splice(index, 1);
  }

}
