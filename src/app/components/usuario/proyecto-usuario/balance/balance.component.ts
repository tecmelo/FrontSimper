import { Component, OnInit, ViewChild } from '@angular/core';
import {ProyectosService} from '../../../../services/proyectos.service';
import {DesarrolloProductoService} from '../../../../services/desarrollo-producto.service';
import {DesarrolloZonaService} from '../../../../services/desarrollo-zona.service';
import {BalanceService} from '../../../../services/balance.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html'
})
export class BalanceComponent implements OnInit {

  @ViewChild('modalPeriodos') public modalPeriodos:ModalDirective;
  @ViewChild('modalConf') public confModal:ModalDirective;
  public totalItems: number = 50;
  public currentPage: number;
  public smallnumPages: number = 0;
  opciones:boolean=false;
  periodo:number;
  periodos = [];

  constructor(private _proyectoService:ProyectosService,
              private _balanceService:BalanceService,
              private _desarrolloZona:DesarrolloZonaService,
              private router:Router,
              private _desarrolloProducto:DesarrolloProductoService) {

   }

  ngOnInit() {
    this.asignarBalance(localStorage.getItem('idProyecto'));
  }

  asignarBalance(idProyecto){
    this.periodos.length = 0;
    this._proyectoService.buscarPeriodos(idProyecto).subscribe(data => {
      if(data.datos.length == 0){
        this.periodo = 1;
        var x = {
          nombre:"Periodo 1",
          numero:1
        }
        this.periodos.push(x);
      }
      else{
        this.periodo = parseInt(data.datos.length) - 1;
        for(let key$ in data.datos){

          if(data.datos[key$].numeroPeriodo != 0){
            var y = {
              nombre:"Periodo "+(data.datos[key$].numeroPeriodo),
              numero:(data.datos[key$].numeroPeriodo)
            }
            this.periodos.push(y);
          }
        }
      }
    });
  }

  pasarPeriodo(){
    var p = localStorage.getItem('numeroPeriodo');
    var proyecto = localStorage.getItem('idProyecto');
    let periodoNuevo = parseInt(p) + 1;
    this._balanceService.getBalanceByIds(proyecto,p).subscribe(data => {
      this._balanceService.crearBalance(proyecto,data.datos[0],periodoNuevo).subscribe(data => {
        if(data.success){
          localStorage.setItem('numeroPeriodo',periodoNuevo.toString());
          this.periodo = this.periodo + 1 ;
          var y = {
            nombre: "Periodo "+this.periodo,
            numero: this.periodo
          }
          this.periodos.push(y);
        }
      });
    });
    this._desarrolloProducto.actualizarPD();
    this._desarrolloZona.actualizarZonasDes();
    this.confModal.show();
  }

  openBalances(){
    this.modalPeriodos.show();

  }

  modalPasarPeriodo(){
    this.confModal.hide();
    this.router.navigate(['Usuario/proyecto/home']);
  }

  transicion(numero){
    console.log(numero)
    this.periodo = numero;
    localStorage.setItem('numeroPeriodo', numero);
    this.modalPeriodos.hide();
  }





}
