import { Component, OnInit , ViewChild,NgModule} from '@angular/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';
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
// import {BrowserAnimationsModule} from '@angular/platform-browser-animations';




@Component({
  selector: 'app-zona-producto',
  templateUrl: './zona-producto.component.html',
  styleUrls: ['./zona-producto.component.css']
})
export class ZonaProductoComponent implements OnInit {
  @ViewChild('modalPeriodoNew') public modalPeriodoNew:ModalDirective;
  @ViewChild('modalPeriodoEdit') public modalPeriodoEdit:ModalDirective;



// options:any = {
//         title : { text : 'simple chart' },
//         series: [{
//           name: 'Sea-Level Pressure',
//
//           data: [1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2, 1013.1, 1016.9, 1018.2, 1016.7],
//           dashStyle: 'shortdot'
//
//         }]
//     };

zonas:zona[];
edit:boolean;
nombreZonasZonas:string[];
graficas:any[];
newPerido:number;
productos:any;
formPeriodoNew:FormGroup;
formPeriodoEdit:FormGroup;




///Graficas
options;
  data;
  ngOnInit() {
    console.log("random","#",Math.random().toString(16).slice(2, 8));

    this.options = {
      chart: {
        type: 'lineChart',
        height: 500,
        width:600,
        margin : {
          top: 50,
          right: 20,
          bottom: 40,
          left: 70
        },
        x: function(d){ return d.x; },
        y: function(d){ return d.y; },
        useInteractiveGuideline: true,
        xAxis: {
          axisLabel: 'Time (ms)'
        },
        yAxis: {
          axisLabel: 'Voltage (v)',
          tickFormat: function(d){
            return d3.format('.02f')(d);
          },
          axisLabelDistance: -5
        }
      }
    };

    this.data =[
      {
        values:[
          {x:1,y:4},
          {x:2,y:4},
          {x:3,y:2},
          {x:4,y:4},
          {x:5,y:7},
          {x:6,y:8},
          {x:7,y:4},

        ],      //values - represents the array of {x,y} data points
        key: 'Sine Wave', //key  - the name of the series.
        color: '#ff7f0e'  //color - optional: choose your own line color.
      },
      {
        values:[
          {x:1,y:5},
          {x:2,y:6},
          {x:3,y:7},
          {x:4,y:8},
          {x:5,y:9},
          {x:6.5,y:2},
          {x:7,y:3},

        ],      //values - represents the array of {x,y} data points
        key: 'Hola', //key  - the name of the series.
        color: 'blue'  //color - optional: choose your own line color.
      }


    ]
    console.log("Data",this.data);
}







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
    console.log("Data para Graficas",this.graficas);

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





  openModalPeriodo(idZona:number,idProducto:number){
    this.formPeriodoNew.controls['idZona'].setValue(idZona);
    this.formPeriodoNew.controls['idProducto'].setValue(idProducto);

    console.log("Datos de Entrada",idZona,idProducto);
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

      this.modalPeriodoEdit.hide();
      setTimeout(() =>
  {
      this.graficas=this._graficasService.returnGraficas();
  },
      1000);
      // console.log("Coomponent",producto)
  }

  borraPeriodo(idZona,idProducto){
    this._graficasService.eliminaPeriodo(idZona,idProducto);
    // console.log(idZona,idProducto);
    setTimeout(() =>
{
    this.graficas=this._graficasService.returnGraficas();
},
    1000);


  }





  agregaPeriodo(producto){
    // this._graficasService.addPeriodo(producto).subscribe();

    this._graficasService.agregaPeriodo(producto);
    console.log("anterior graf",this.graficas)

    console.log("new graf",this.graficas);
    //console.log(this.zonas);
    // console.log(producto);
    setTimeout(() =>
{
    this.graficas=this._graficasService.returnGraficas();
},
    1000);

    this.modalPeriodoNew.hide();

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





  onSelect(event) {
    console.log(event);
  }


  sinAndCos() {
      var sin = [],sin2 = [],
        cos = [];

      //Data is represented as an array of {x,y} pairs.
      for (var i = 0; i < 100; i++) {
        sin.push({x: i, y: Math.sin(i/10)});
        sin2.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) *0.25 + 0.5});
        cos.push({x: i, y: .5 * Math.cos(i/10+ 2) + Math.random() / 10});
      }

      //Line chart data should be sent as an array of series objects.
      return [
        {
          values: sin,      //values - represents the array of {x,y} data points
          key: 'Sine Wave', //key  - the name of the series.
          color: '#ff7f0e'  //color - optional: choose your own line color.
        },
        {
          values: cos,
          key: 'Cosine Wave',
          color: '#2ca02c'
        },
        {
          values: sin2,
          key: 'Another sine wave',
          color: '#7777ff',
          area: true      //area - set to true if you want this line to turn into a filled area chart.
        }
      ];
    }
  }
