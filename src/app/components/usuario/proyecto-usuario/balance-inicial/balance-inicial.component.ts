import { Component, OnInit } from '@angular/core';
import {ResultadosService} from '../../../../services/resultados.service';
import { PdfmakeService } from 'ng-pdf-make/pdfmake/pdfmake.service';
import { Cell, Row, Table } from 'ng-pdf-make/objects/table';

@Component({
  selector: 'app-balance-inicial',
  templateUrl: './balance-inicial.component.html',
  styleUrls: ['./balance-inicial.component.css']
})
export class BalanceInicialComponent implements OnInit {
  balanceInicial:any;
  constructor(private _resultadosService:ResultadosService,
              private pdfmake: PdfmakeService) {
    this.balanceInicial = this._resultadosService.balanceInicialAnterior();
    console.log(this.balanceInicial)
  }
  

  ngOnInit() {
  }


}
