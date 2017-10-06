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

  compraMaquinaria(x,y){
    this.comprar(x).subscribe(data => {
      for(let key$ in data.datos){
        this.maquinasCompradas[key$] = data.datos[key$];
      }
    });
    this.cobrar(y).subscribe();
  }

  cobrar(x){
    let headers = new Headers({
      'Content-Type':'application/json'
    });
    return this.http.post('http://localhost:3000/maquinariacomprada/cobrar/', x, {headers}).map( res => res.json());
  }

  comprar(x){
    let headers = new Headers({
      'Content-Type':'application/json'
    });
    return this.http.post('http://localhost:3000/maquinariacomprada/compra/', x, {headers}).map( res => res.json());
  }

  asingar(x){
    let headers = new Headers({
      'Content-Type':'application/json'
    });
    console.log(x)
    return this.http.post('http://localhost:3000/maquinariacomprada/asignar/', x, {headers}).map( res => res.json());
  }

}
