import { Injectable } from '@angular/core';
import {maquinaria} from '../app.interfaces';
import {Http, Headers} from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class MaquinariaService {

//Aqui va el url donde se mandaran los datos

  maquinas:maquinaria[]=new Array();

  constructor(private http:Http) {}

  getMaquinas(){
    return this.http.get('http://localhost:3000/maquinaria/').map(res => res.json());
  }

  establecerValores(){
    this.maquinas.length = 0;
    this.getMaquinas().skipWhile(v => v.length === 0).take(1).subscribe(data => {
      for(let key$ in data){
          this.maquinas.push(data[key$]);
      }
    });
    return this.maquinas;
  }

  returnMaquinas(){
    return this.establecerValores();
  }

  setMaquina(maquina:maquinaria){
    let headers = new Headers({
      'Content-Type':'application/json'
    });
    console.log(maquina.idMaquinaria,"Modificandose");
    for(let i=0;this.maquinas.length>i;i++){
      if(this.maquinas[i].idMaquinaria==maquina.idMaquinaria){
        this.maquinas.splice(i,1);
        this.maquinas.push(maquina);
      }
    }
    return this.http.post('http://localhost:3000/maquinaria/modify/'+maquina.idMaquinaria, maquina, {headers}).map( res => res.json());
  }

  addMaquina(maquina:maquinaria){
    let headers = new Headers({
      'Content-Type':'application/json'
    });
    console.log("maquina: ",maquina.nombreMaq, " agregada")
    return this.http.post('http://localhost:3000/maquinaria/register', maquina, {headers}).map( res => res.json());
  }



  guardarMaquina(maquinaria:maquinaria){
    this.addMaquina(maquinaria).subscribe(data => {
      for(let key$ in data.datos){
          this.maquinas[key$] = data.datos[key$];
      }
    });
  }



  deleteMauqina(id:number){
    for(let i=0;this.maquinas.length>i;i++){
      if(this.maquinas[i].idMaquinaria==id){
        this.maquinas.splice(i,1);
      }
    }
    console.log('http://localhost:3000/maquinaria/delete/'+id);
    return this.http.get('http://localhost:3000/maquinaria/delete/'+id).map(res => res.json());

  }

}
