import { Component, OnInit,ViewChild } from '@angular/core';
import {OperacionService} from '../../../../services/operacion.service';
import {ProductoService} from '../../../../services/producto.service';
import {ZonasService} from '../../../../services/zonas.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';

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
  valueBar:number
  ventaO:any={
    idZona:null,
    cantiadVenta:null,
    cantidadAlmacen:null

  }
  selectedVenta:any={
    venta:this.ventaO,
    idProducto:null
  };

  vendiendo:boolean=false;
  produciendo:boolean=false;
  openConf:boolean=false;
  openLoad:boolean=false;


  @ViewChild('modalProgressVenta') public modalProgressVenta:ModalDirective;

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
    this._operacionService.registerOperacion(id,form.idZona,form.cantidadAlmacen,form.cantidadVenta);

  }



  progressVenta(){
    this.vendiendo=false;
    this.openLoad=true;
    this.produciendo=true;
    setTimeout(()=>{this.produciendo=false;this.vendiendo=true;}, 2000);
    setTimeout(()=>this.openLoad=false, 4000);



  }

  cobrarVenta(){
    this.openConf=false;
    this.progressVenta();
    console.log(this.selectedVenta);
    var p = this.selectedVenta.idProducto;
    var idZ = this.selectedVenta.venta.idZona;
    var cv = this.selectedVenta.ventacantidadVenta;
    var ca = this.selectedVenta.venta.cantidadAlmacen;
    this._operacionService.registerOperacion(p,idZ,ca,cv);

  }

  selectVenta(venta,idProducto){
    this.openConf=true;
    this.selectedVenta={
      venta:venta,
      idProducto:idProducto
    }

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
