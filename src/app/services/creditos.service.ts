import { Injectable } from '@angular/core';
import {credito} from '../app.interfaces';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CreditosService {
  creditos:credito[]=new Array();

  constructor(private http:Http) { }

   establecerValores(){
     this.creditos.length = 0;
     this.getCreditos().subscribe(data => {
       for(let key$ in data){
           this.creditos.push(data[key$]);
       }
     });
     return this.creditos;
   }

   getCreditos(){
     return this.http.get('http://localhost:3000/prestamo/').map(res => {
       return res.json();
     });
   }

   returnCreditos(){
     return this.establecerValores();
   }

  setCreditos(credito:credito){
    let headers = new Headers({
      'Content-Type':'application/json'
    });
    console.log(credito.idPrestamos,"Modificandose");
    for(let i=0;this.creditos.length>i;i++){
      if(this.creditos[i].idPrestamos==credito.idPrestamos){
        this.creditos.splice(i,1);
        this.creditos.push(credito);
        console.log("credito: ",this.creditos[i].idPrestamos,"modificado");


      }
    }
    return this.http.post('http://localhost:3000/prestamo/modify/'+credito.idPrestamos, credito, {headers}).map( res => res.json());
  }



  addCredito(credito:credito){
    let headers = new Headers({
      'Content-Type':'application/json'
    });
    console.log("Producto: ",credito.nombrePrestamo,"Agregado" );
    return this.http.post('http://localhost:3000/prestamo/register', credito, {headers}).map( res => res.json());

  }

  guardarCredito(credito:credito){
    this.addCredito(credito).subscribe(data => {
      for(let key$ in data.datos){
          this.creditos[key$] = data.datos[key$];
      }
    });
  }

  deleteCredito(id:number){
    console.log("Eliminando",id);
    for(let i=0;this.creditos.length>i;i++){
      if(this.creditos[i].idPrestamos==id){
        console.log(this.creditos[i].idPrestamos);
        this.creditos.splice(i,1);
        console.log("credito: ",id,"eliminado");
      }
    }
    console.log('http://localhost:3000/prestamo/delete/'+id);
    return this.http.get('http://localhost:3000/prestamo/delete/'+id).map(res => res.json());


  }


}
