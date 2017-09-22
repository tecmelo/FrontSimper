import { Injectable } from '@angular/core';
import {maquinaria} from '../app.interfaces';
import {Http, Headers} from '@angular/http';
import {MaquinariaService} from './maquinaria.service';
import {BalanceService} from './balance.service';
import 'rxjs/Rx';

@Injectable()
export class CompraMaquinariaService {
  maqCompradas:any[]=new Array();
  maquinas:maquinaria[]=new Array();
  maquinasCompradas:any[]=[];
  balanceTemporal:any;



  constructor(private _maquinariaService:MaquinariaService,
              private _balanceService:BalanceService,
              private http:Http) {
   }

   establecerValores(){
     this.maquinasCompradas.length = 0;
     this.getMaquinariaC().subscribe( data => {
       for(let key$ in data.datos){
           this.maquinasCompradas.push(data.datos[key$]);
       }
     });
     return this.maquinasCompradas;
   }

   returnMaquinasCompradas(){
     return this.establecerValores();
   }


   getMaquinariaC(){
    return this.http.get('http://localhost:3000/maquinariacomprada/'+localStorage.getItem('idProyecto')).map(res => res.json());
   }

  compraMaquinaria(x,costo,dep){
    this.comprar(x).subscribe(data => {
      for(let key$ in data.datos){
        this.maquinasCompradas[key$] = data.datos[key$];
      }
    });
    //this.cobrar(costo,dep);
  }

  // cobrar(costo,dep){
  //   this._balanceService.getBalance().subscribe( data => {
  //       var id = data.datos[0].idBalance;
  //       var x = {
  //         cajaBancos:data.datos[0].cajaBancos,
  //         maqEquipo:data.datos[0].maqEquipo,
  //         IVAPorEnterar:data.datos[0].IVAPorEnterar,
  //         utilidadAcum: data.datos[0].utilidadAcum,
  //         depMaqEquipo: data.datos[0].depMaqEquipo
  //       }
  //       var iva11 = (((costo*.15)/12)*11);
  //       var ivaMaq = (costo*.15);
  //       var depMaq = costo*(dep/100);
  //       x.IVAPorEnterar = x.IVAPorEnterar - (iva11/11);
  //       x.depMaqEquipo = x.depMaqEquipo + depMaq;
  //       x.cajaBancos= x.cajaBancos - (costo + ivaMaq - iva11);
  //       x.maqEquipo =(x.maqEquipo +costo);
  //       x.utilidadAcum = x.utilidadAcum - depMaq;
  //
  //       this._balanceService.editarBalance(id,x).subscribe();
  //   });
  // }

  comprar(x){
    let headers = new Headers({
      'Content-Type':'application/json'
    });
    return this.http.post('http://localhost:3000/maquinariacomprada/compra/', x, {headers}).map( res => res.json());
  }

}
