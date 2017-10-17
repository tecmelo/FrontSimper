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

  progressVenta(){
    this.vendiendo=false;
    this.openLoad=true;
    this.produciendo=true;
    setTimeout(()=>{this.produciendo=false;this.vendiendo=true;}, 2000);
    setTimeout(()=>this.openLoad=false, 4000);



  }

  cobrarVenta(){
    this.openConf=false;
    var p = this.selectedVenta.idProducto;
    var idZ = this.selectedVenta.venta.idZona;
    var cv = this.selectedVenta.venta.cantidadVenta;
    var ca = this.selectedVenta.venta.cantidadAlmacen;
    console.log(idZ)
    var x = {
      "Producto_idProducto":p,
      "Zona_idZonas":idZ,
      "Proyecto_idProyecto":parseInt(localStorage.getItem('idProyecto')),
      "Usuario_idUsuario":parseInt(localStorage.getItem('idUsuario')),
      "numeroPeriodo":parseInt(localStorage.getItem('numeroPeriodo')),
      "unidadesAlmacenadas":ca,
      "unidadesVendidas":cv
    }

    this._operacionService.validarOperacion(x).subscribe(data => {
      if(data.success){
        this.progressVenta();
        this._operacionService.registerOperacion(x);
      }
      else{
        alert(data.msg);
      }
    });
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
