import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Mes } from './month.enum';

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.css']
})
export class ChipComponent implements OnInit {

  @Input() mes: number;
  @Input() numeroCotas: number;
  @Output() removerCondicionalEvent = new EventEmitter();
  Mes = Mes;

  constructor() { }

  ngOnInit() {}

  removerChip() {
    this.removerCondicionalEvent.emit(this.mes)
  }

}
