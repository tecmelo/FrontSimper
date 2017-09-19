import { Injectable } from '@angular/core';
import {ZonasService} from './zonas.service';
import {ProductoService} from './producto.service';
import {zona} from '../app.interfaces';
import { HttpModule } from '@angular/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

@Injectable()
export class GraficasService {
  graficas = [];
  zonas = [];

  constructor(private _productosService:ProductoService, private _zonasService:ZonasService,
              private http:Http) {

               }


  getZonas(){
    return this.http.get('http://localhost:3000/demanda/grafica/').map(res => res.json());
  }


  deletePeriodo(idZonaA,idProductoA,numPeriodoA){
    let headers = new Headers({
      'Content-Type':'application/json'
    });

    return this.http.post('http://localhost:3000/demanda/registerdemanda/',
    {  idZona:idZonaA,
	     idProducto:idProductoA,
	     numPeriodo:numPeriodoA,
      },
     {headers}).map( res => res.json());

  }

  estableceZonasGraf(){
    this.zonas.length = 0;
    this.getZonas().subscribe(data => {
      console.log("Servici Graf",data)
      for(let key$ in data.datos){
        this.zonas.push(data.datos[key$]);
      }
    })
    return this.zonas;
  }

  returnZonas(){
    this.estableceZonasGraf();
    return this.zonas;
  }




}
