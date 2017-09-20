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
    this.graficas=this.setGraficas();
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
    console.log("Datos de Entrada",idZona,idProducto);
    this.modalPeriodoNew.show();


  }

  openModalPeriodoEdit(idZona,idProducto,numPeriodo){
    console.log(idZona,idProducto,numPeriodo);
    this.formPeriodoEdit.get('idZona').setValue(idZona);
    this.formPeriodoEdit.get('idProducto').setValue(idProducto);
    this.formPeriodoEdit.get('numPeriodo').setValue(numPeriodo);
    this.modalPeriodoEdit.show()

  }

  editaPeriodo(producto){
      this._graficasService.setPeriodo(producto).subscribe();
      console.log("Coomponent",producto)
  }

  borraPeriodo(idZona,idProducto){
    console.log(idZona,idProducto);
    this._graficasService.deletePeriodo(idZona,idProducto).subscribe();
  }

  actualizaPeriodoNew(producto){
    for(let nZona in this.zonas){
      if(this.zonas[nZona].idZona==producto.idZona){
        for(let nProductos in this.zonas[nZona].productos){
          console.log("Comp",this.zonas[nZona].productos[nProductos].idProducto,producto.idProducto )
          if(this.zonas[nZona].productos[nProductos].idProducto==producto.idProducto ){
            console.log(this.zonas[nZona].productos[nProductos].periodos);
            console.log(this.zonas[nZona].productos[nProductos].periodos.length)
            // this.zonas[nZona].productos[nProductos].periodos.push(
            //                                                     {
            //                                                     numPeriodo:this.zonas[nZona].productos[nProductos].periodos.length,
            //                                                     cantidad:pro
            //                                                   })

          }
        }
      }
    }
  }



  agregaPeriodo(producto){
    this._graficasService.addPeriodo(producto).subscribe();
    this.actualizaPeriodoNew(producto);
    console.log(producto);
    this.modalPeriodoNew.hide();
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
