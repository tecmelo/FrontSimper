import { Component, OnInit } from '@angular/core';
import {OperacionService} from '../../../../services/operacion.service';
import {ProductoService} from '../../../../services/producto.service';
import {ZonasService} from '../../../../services/zonas.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

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

  constructor(private _operacionService:OperacionService,
              private _zonasService: ZonasService,
              private _productoService:ProductoService) {
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
    console.log(form)
    console.log(id)
    this._operacionService.registerOperacion(id,form.idZona,form.cantidadAlmacen,form.cantidadVenta);
  }

  cobrarVenta(form,id){
    var p = this.getProducto(id);
    var cv = form.cantidadVenta;
    var ca = form.cantidadAlmacen;
    this._operacionService.cobrarVenta(p,cv,ca);
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
