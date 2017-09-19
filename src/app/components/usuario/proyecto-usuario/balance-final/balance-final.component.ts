import { Component, OnInit } from '@angular/core';
import {ResultadosService} from '../../../../services/resultados.service';

@Component({
  selector: 'app-balance-final',
  templateUrl: './balance-final.component.html',
  styleUrls: ['./balance-final.component.css']
})
export class BalanceFinalComponent implements OnInit {
  balanceFinal:any;

  constructor(private _resultadosService:ResultadosService) {
    this.balanceFinal = this._resultadosService.getBalanceFinal();
  }

  ngOnInit() {
  }

}
