import { Component, OnInit } from '@angular/core';
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


@Component({
  selector: 'app-zona-producto',
  templateUrl: './zona-producto.component.html',
  styleUrls: ['./zona-producto.component.css']
})
export class ZonaProductoComponent implements OnInit {



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
editaPeriodo:boolean[][];
newPerido:number;
productos:any;



  constructor
  (
    private _demandaService:ZonasService,
    private _productosService:ProductoService,
    private modalService:NgbModal,
    private _graficasService:GraficasService
  ) {
    this.zonas=_graficasService.returnZonas();
    console.log("Original",this.zonas)
    this.graficas=this.setGraficas();
    // console.log(this.graficas);
    this.productos=this._productosService.returnProductos();


  }


  ngOnInit() {






  }

  borraPeriodo(idZona,idProducto,numPeriodo){
    this._graficasService.deletePeriodo(idZona,idProducto,numPeriodo).subscribe();
  }

  numPeriodos(producto){
    this._graficasService.getZonas().subscribe(data => {
      for(let zona of data.datos){


      }
    })

  }

  setGraficas(){
    let graficas:any[];
    let grafica:any[];
    graficas=new Array;


      this._graficasService.getZonas().subscribe(data => {
        for(let key$ in data.datos){
          console.log("Zona completa",data.datos[key$])
          graficas.push(
            {
              title:data.datos[key$].nombreZona,
              series: this.getSeries(data.datos[key$]),
              xAxis: [{
                    categories: [1,2,3,4,5,6,7,8,9,10,11],
                    crosshair: true
                }],


            }
          )

        }
      })

    //console.log(graficas);

    return graficas;

  }


  getSeries(zona:any){
    console.log(zona);
    let series:any;
    series=new Array;
    for(let producto of zona.productos){
      console.log("Aqui",producto)
      series.push(
        {
          name:this.getNameById(producto.Producto_idProducto),
          data:this.getDataPeriodos(producto.periodos)
        }
      )


    }

    return series;

  }

  getDataPeriodos(periodos:any[]){
    let data:number[];
    data=new Array();

      for(let periodo of periodos){
        data.push(periodo.cantidad);
        //console.log(periodo)
      }
      data.splice(0,1)

    return data;
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
