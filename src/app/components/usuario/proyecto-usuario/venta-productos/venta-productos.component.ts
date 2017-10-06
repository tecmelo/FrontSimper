import { Component, OnInit,ViewChild } from '@angular/core';
import {OperacionService} from '../../../../services/operacion.service';
import {ProductoService} from '../../../../services/producto.service';
import {ZonasService} from '../../../../services/zonas.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {NgProgressService} from "ng2-progressbar";

@Component({
  selector: 'app-venta-productos',
  templateUrl: './venta-productos.component.html',
  styleUrls: ['./venta-productos.component.css']
})
export class VentaProductosComponent implements OnInit {
  productosOperacion = [];
  productos=[];
  zonas=[];
  ventasForm:FormGroup;
  valueBar:number;
  @ViewChild('modalProgressVenta') public modalProgressVenta:ModalDirective;

  constructor(private _operacionService:OperacionService,
              private _zonasService: ZonasService,
              private _productoService:ProductoService,
            private pService: NgProgressService) {
    this.zonas=this._zonasService.returnZonasNormales();
    this.productos=this._productoService.returnProductos();
    this.productosOperacion = this._operacionService.returnProductosOperacion();
    this.ventasForm=new FormGroup({
      'idZona':new FormControl(),
      'cantidadVenta':new FormControl(),
      'cantidadAlmacen':new FormControl()
    });
  }

  ngOnInit() {
  }


  venta(form,id){
    this._operacionService.registerOperacion(id,form.idZona,form.cantidadAlmacen,form.cantidadVenta);

  }



  progressVenta(){
    //this.modalProgressVenta.show();
    //this.pService.start();
    this.valueBar=0;
    for(let i=0;i<=100;i++){
      setTimeout(function() {

      console.log(this.valueBar)
    }, 1000);
      this.valueBar=i;
    }

  }

  cobrarVenta(form,id){
    var p = id;
    var idZ = form.idZona;
    var cv = form.cantidadVenta;
    var ca = form.cantidadAlmacen;
    this._operacionService.registerOperacion(p,idZ,ca,cv);
      this.progressVenta();
  }

  getNameByIdProducto(id:number){
    for(let producto of this.productos){
      if(producto.idProducto==id)
       return producto.nombreProd;
    }
    return "id no encontrado";

  }

  getNameByIdZona(id:number){
    for(let zona of this.zonas){
      if(zona.idZona==id)
       return zona.nombreZona;
    }
    return "id no encontrado";

  }

  getProducto(id){
    var prod = null;
    for(let producto of this.productos){
      if(producto.idProducto == id){
        prod = producto;
        break;
      }
    }
    return prod;
  }
}
