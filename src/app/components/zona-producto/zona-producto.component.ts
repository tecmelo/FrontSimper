import { Component, OnInit , ViewChild} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators,FormArray,FormBuilder} from '@angular/forms';
import {zona,producto,select,productoPeriodo,periodos,periodosAct} from '../../app.interfaces';
import {ProductoService} from '../../services/producto.service';
import {ZonasService} from '../../services/zonas.service';
import {Router} from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ChartModule } from 'angular2-highcharts';
import * as highcharts from 'highcharts'
import {GraficasService} from '../../services/graficas.service';
import { ModalDirective } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-zona-producto',
  templateUrl: './zona-producto.component.html',
  styleUrls: ['./zona-producto.component.css']
})
export class ZonaProductoComponent implements OnInit {
  @ViewChild('modalPeriodoNew') public modalPeriodoNew:ModalDirective;
  @ViewChild('modalPeriodoEdit') public modalPeriodoEdit:ModalDirective;



options:any = {
        title : { text : 'simple chart' },
        series: [{
          name: 'Sea-Level Pressure',

          data: [1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2, 1013.1, 1016.9, 1018.2, 1016.7],
          dashStyle: 'shortdot'

        }]
    };

zonas:zona[];
edit:boolean;
nombreZonasZonas:string[];
graficas:any[];
newPerido:number;
productos:any;
formPeriodoNew:FormGroup;
formPeriodoEdit:FormGroup;



  constructor
  (
    private _demandaService:ZonasService,
    private _productosService:ProductoService,
    private modalService:NgbModal,
    private _graficasService:GraficasService
  ) {
    this.zonas=_graficasService.returnZonas();
    console.log("Original",this.zonas)
    this.graficas=this._graficasService.setGraficas();
    // console.log(this.graficas);
    this.productos=this._productosService.returnProductos();

    this.formPeriodoNew= new FormGroup({
      'idZona':new FormControl('',Validators.required),
      'idProducto':new FormControl('',Validators.required),
      'cantidad':new FormControl('',Validators.required)
    });

    this.formPeriodoEdit= new FormGroup({
      'idZona':new FormControl('',Validators.required),
      'idProducto':new FormControl('',Validators.required),
      'numPeriodo':new FormControl('',Validators.required),
      'cantidad':new FormControl('',Validators.required)
    });

  }


  ngOnInit() {






  }

  openModalPeriodo(idZona:number,idProducto:number){
    this.formPeriodoNew.controls['idZona'].setValue(idZona);
    this.formPeriodoNew.controls['idProducto'].setValue(idProducto);
    // console.log(idZona,idProducto);
    this.modalPeriodoNew.show();


  }

  openModalPeriodoEdit(idZona,idProducto,numPeriodo,cantidad){
    // console.log(idZona,idProducto,numPeriodo);
    console.log(cantidad)
    this.formPeriodoEdit.get('idZona').setValue(idZona);
    this.formPeriodoEdit.get('idProducto').setValue(idProducto);
    this.formPeriodoEdit.get('numPeriodo').setValue(numPeriodo);
    this.formPeriodoEdit.get('cantidad').setValue(cantidad);

    this.modalPeriodoEdit.show()

  }

  editaPeriodo(producto){
      this._graficasService.editaPeriodo(producto);
      // console.log("Coomponent",producto)
  }

  borraPeriodo(idZona,idProducto){
    // console.log(idZona,idProducto);
    this._graficasService.eliminaPeriodo(idZona,idProducto);
  }





  agregaPeriodo(producto){
    // this._graficasService.addPeriodo(producto).subscribe();
    this._graficasService.agregaPeriodo(producto);
    console.log(this.zonas);
    // console.log(producto);

    this.modalPeriodoNew.hide();
    this.graficas=this._graficasService.returnGraficas();
  }

  numPeriodos(producto){
    this._graficasService.getZonas().subscribe(data => {
      for(let zona of data.datos){


      }
    })

  }


  getNameById(id:number){

    //console.log(this.productos)
    for(let producto of this.productos){
      //console.log(producto.idProducto);
      if(producto.idProducto==id)
       return producto.nombreProd;
    }
    return "id no encontrado";

  }




















}
