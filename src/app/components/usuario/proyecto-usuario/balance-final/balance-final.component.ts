import { Component, OnInit } from '@angular/core';
import {BalanceService} from '../../../../services/balance.service';
import {ResultadosService} from '../../../../services/resultados.service';

@Component({
  selector: 'app-balance-final',
  templateUrl: './balance-final.component.html',
  styleUrls: ['./balance-final.component.css']
})
export class BalanceFinalComponent implements OnInit {
  balanceFinal:any;

  constructor(private _resultadosService:ResultadosService, private _balanceService:BalanceService) {
    this._balanceService.getBalanceFinal().subscribe();
    setTimeout(() => {
     this.balanceFinal = this._resultadosService.getBalanceFinal();
   }, 1000);
  }

  ngOnInit() {
  }

}
