import { Injectable } from '@angular/core';
import {proyecto} from '../app.interfaces';
import {Router}  from '@angular/router';
import {UsuarioMaquinariaService} from './usuario-maquinaria.service';
import {UsuarioProductoService} from './usuario-producto.service';
import {UsuarioZonaService} from './usuario-zona.service';
import {DesarrolloProductoService} from './desarrollo-producto.service';
import {AuxiliarService} from './auxiliar.service';
import {DesarrolloZonaService} from './desarrollo-zona.service';
import {CompraMaquinariaService} from './compra-maquinaria.service';
import { BalanceService} from './balance.service';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpModule } from '@angular/http';

@Injectable()
export class ProyectosService {

  proyectos:proyecto[]=new Array();

  constructor(private http:Http, private _balanceService:BalanceService,
              private _usuarioMaquinariaService:UsuarioMaquinariaService,
              private _usuarioProductoService:UsuarioProductoService,
              private router:Router,
              private _auxiliarService:AuxiliarService,
              private _desarrolloProductoService:DesarrolloProductoService,
              private _desarrolloZonaService:DesarrolloZonaService,
              private _usuarioZonaService:UsuarioZonaService,
              private _CompraMaquinariaService:CompraMaquinariaService,
              private _usuarioZona:UsuarioZonaService) { }

  establecerValores(){
    this.proyectos.length = 0;
    this.getProyectos().subscribe(data => {
      for(let key$ in data){
          this.proyectos.push(data[key$]);
      }

    });
    return this.proyectos;
  }

returnUsuarios(){
 return this.establecerValores();
}

  setProyecto(proyecto:proyecto){
    let headers = new Headers({
      'Content-Type':'application/json'
    });
    for(let i=0;this.proyectos.length>i;i++){
      if(this.proyectos[i].idProyecto==proyecto.idProyecto){
        this.proyectos.splice(i,1);
        this.proyectos.push(proyecto);
      }
    }
    return this.http.post('http://localhost:3000/proyecto/modify/'+proyecto.idProyecto, proyecto, {headers}).map( res => res.json());
  }

  eliminaProyecto(id:number){
    for(let i=0;this.proyectos.length>i;i++){
      if(this.proyectos[i].idProyecto==id){
        this.proyectos.splice(i,1);
      }
    }
    return this.http.get('http://localhost:3000/proyecto/delete/'+id).map(res => res.json());

  }

  buscarPeriodos(idProyecto){
    return this.http.get('http://localhost:3000/balance/'+idProyecto).map(res => res.json());
  }

  asignarBalance(idProyecto){
    this.buscarPeriodos(idProyecto).subscribe(data => {
      if(data.datos.length == 0){
        this.asignarMaquinaria(idProyecto,localStorage.getItem('idUsuario'));
        this.crearAuxiliar(idProyecto);
        this.asginarProductos(idProyecto,localStorage.getItem('idUsuario'));
        this.asignarZonas(idProyecto,localStorage.getItem('idUsuario'));
        this.asginarPeriodoCero(idProyecto);
        localStorage.setItem('numeroPeriodo','1');
      }
      else{
        var num = parseInt(data.datos.length) - 1;
        localStorage.setItem('numeroPeriodo',num.toString());
      }
    });
  }

  asginarProductos(idProyecto, idUsuario){
    this._usuarioProductoService.getProductosU(idUsuario).subscribe(data => {
      for(let key$ in data.datos){
        var x = {
          Proyectos_idProyecto:idProyecto,
          Productos_idProducto:data.datos[key$].idProducto,
          desarrollado:1,
          periodoInicio:0,
          ultimoPeriodoDes:0,
          periodosDes:0
        }

        this._desarrolloProductoService.desarrollar(x).subscribe();
      }
    });
  }

  entrar(){
    this.router.navigate(['Usuario/proyecto']);
  }

  crearAuxiliar(idProyecto){
    var x = {
      Proyectos_idProyecto:idProyecto,
      Balance_numeroPeriodo:1
    }
    this._auxiliarService.addAuxiliar(x).subscribe();
  }

  asignarZonas(idProyecto, idUsuario){
    this._usuarioZonaService.getZonasU(idUsuario).subscribe(data => {
      for(let key$ in data.datos){
        var x = {
          Producto_idProducto:data.datos[key$].idProducto,
          Zona_idZonas:data.datos[key$].idZona,
          Proyecto_idProyecto:idProyecto,
          Proyecto_Usuario_idUsuario:idUsuario,
          desarrollado:1,
          periodoInicio:0,
          ultimoPeriodoDes:0,
          periodosDes:0
        }
        this._desarrolloZonaService.addZona(x).subscribe();
      }
    });
  }

  asignarMaquinaria(idProyecto, idUsuario){
    this._usuarioMaquinariaService.getMaquinariasU(idUsuario).subscribe(data => {
      for(let key$ in data.datos){
        var x = {
          Maquinaria_idMaquinaria:data.datos[key$].idMaquinaria,
          Proyectos_idProyecto:idProyecto,
          cantidad:data.datos[key$].cantidad
        }
        this._CompraMaquinariaService.comprar(x).subscribe();
      }
    });
  }

  asginarPeriodoCero(idProyecto){
    this.buscarDatosUsuario().subscribe(data => {
      for(let key$ in data){
        if(data[key$].idUsuario == localStorage.getItem('idUsuario')){
          this.crearBalanceUno(idProyecto,data[key$],1).subscribe();
          this.crearBalanceCero(idProyecto,data[key$],0).subscribe();
          break;
        }
      }
    });
  }

  buscarDatosUsuario(){
    return this.http.get('http://localhost:3000/usuario/').map(res => res.json());
  }

  crearBalanceUno(idProyecto,data,num){
    var dep = data.maqEquipo*.10;
    var Balance = {
    "IVAPorEnterar":data.IVAPorEnterar,
    "numeroPeriodo":num,
    "imptosPorPagar" :data.imptosPorPagar,
    "proveedores":data.proveedores,
    "PTUPorPagar":data.PTUPorPagar,
    "prestamosMenosAnio":data.prestamosMenosAnio,
    "prestamosMasAnio":data.prestamosMasAnio,
    "cajaBancos":data.cajaBancos,
    "cuentasPorCobrar":data.cuentasPorCobrar,
    "IVAAcreditable":data.IVAAcreditable,
    "almacenArtTerm":data.almacenArtTerm,
    "almacenMateriales":data.almacenMateriales,
    "terreno":data.terreno,
    "edifInsta":data.edifInsta,
    "maqEquipo":data.maqEquipo,
    "mueblesEnseres":data.mueblesEnseres,
    "pagosAnticipado":data.pagosAnticipado,
    "gastosAmortizacion":data.gastosAmortizacion,
    "capitalSocial":data.capitalSocial,
    "reservaLegal":data.reservaLegal,
    "utilidadAcum":data.utilidadAcum - dep,
    "depEdif":0,
    "depMueblesEnseres":0,
    "eqTrans":data.eqTrans,
    "Proyectos_idProyecto":idProyecto,
    "depTerreno":0,
    "depMaqEquipo":dep,
    "depEqTrans":0
    }
    let headers = new Headers({
      'Content-Type':'application/json'
    });
    return this.http.post('http://localhost:3000/balance/register/', Balance, {headers}).map( res => res.json());
  }

  crearBalanceCero(idProyecto,data,num){
    var Balance = {
    "IVAPorEnterar":data.IVAPorEnterar,
    "numeroPeriodo":num,
    "imptosPorPagar" :data.imptosPorPagar,
    "proveedores":data.proveedores,
    "PTUPorPagar":data.PTUPorPagar,
    "prestamosMenosAnio":data.prestamosMenosAnio,
    "prestamosMasAnio":data.prestamosMasAnio,
    "cajaBancos":data.cajaBancos,
    "cuentasPorCobrar":data.cuentasPorCobrar,
    "IVAAcreditable":data.IVAAcreditable,
    "almacenArtTerm":data.almacenArtTerm,
    "almacenMateriales":data.almacenMateriales,
    "terreno":data.terreno,
    "edifInsta":data.edifInsta,
    "maqEquipo":data.maqEquipo,
    "mueblesEnseres":data.mueblesEnseres,
    "pagosAnticipado":data.pagosAnticipado,
    "gastosAmortizacion":data.gastosAmortizacion,
    "capitalSocial":data.capitalSocial,
    "reservaLegal":data.reservaLegal,
    "utilidadAcum":data.utilidadAcum,
    "depEdif":0,
    "depMueblesEnseres":0,
    "eqTrans":data.eqTrans,
    "Proyectos_idProyecto":idProyecto,
    "depTerreno":0,
    "depMaqEquipo":0,
    "depEqTrans":0
    }
    let headers = new Headers({
      'Content-Type':'application/json'
    });
    return this.http.post('http://localhost:3000/balance/register/', Balance, {headers}).map( res => res.json());
  }

  addProyecto(proyecto:proyecto){
    let headers = new Headers({
      'Content-Type':'application/json'
    });
    return this.http.post('http://localhost:3000/proyecto/register/'+localStorage.getItem('idUsuario'), proyecto, {headers}).map( res => res.json());
  }

  agregaProyecto(proyecto:proyecto){
    this.addProyecto(proyecto).subscribe( data => {
      for(let key$ in data.datos){
          this.proyectos[key$] = data.datos[key$];
      }
    });
  }



  getProyectos(){
    return this.http.get('http://localhost:3000/proyecto/'+localStorage.getItem('idUsuario')).map(res => res.json());
  }

}
