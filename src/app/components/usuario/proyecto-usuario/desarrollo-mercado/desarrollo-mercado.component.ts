import { Component, OnInit, ViewChild } from '@angular/core';
import {ZonasService} from '../../../../services/zonas.service';
import {ProductoService} from '../../../../services/producto.service';
import {DesarrolloZonaService} from '../../../../services/desarrollo-zona.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {producto} from '../../../../app.interfaces';
import { ModalDirective } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-desarrollo-mercado',
  templateUrl: './desarrollo-mercado.component.html',
  styleUrls: ['./desarrollo-mercado.component.css']
})
export class DesarrolloMercadoComponent implements OnInit {

  @ViewChild('modalConfDes') public modalConfDes:ModalDirective;
  @ViewChild('modalConfPago') public modalConfPago:ModalDirective;


  zonas=[]
  productos:producto[]=[];
  productosZonaSinDesarrollar:any[] = [];
  productosZonaEnDesarrollo: any[] = [];
  productosZonaDesarrollados: any[] = [];
  zonaForm:FormGroup;
  productoSelectedAdd:any;
  productoSelectedPago:any;

  constructor(private _zonasService: ZonasService,
              private _desarrolloZonaService:DesarrolloZonaService,
              private _productoService:ProductoService) {

    this.zonas=this._zonasService.returnZonasNormales();
    this.productos=this._productoService.returnProductos();
    this.productosZonaSinDesarrollar = this._desarrolloZonaService.returnProductosDeZonaSinDesarrollar();
    this.productosZonaEnDesarrollo = this._desarrolloZonaService.returnProductosDeZonaEnDesarrollo();
    this.productosZonaDesarrollados = this._desarrolloZonaService.returnProductosDeZonaDesarrollados();
    this.zonaForm=new FormGroup({
      'idProducto':new FormControl('',Validators.required)
    });

    this.productoSelectedAdd={
      idProducto:null,
      idZona:null
    };

    console.log(this.productosZonaDesarrollados);
   }

  ngOnInit() {
  }

  selecciona(producto,idZona){
    if(producto==this.productoSelectedAdd.idProducto && idZona==this.productoSelectedAdd.idZona)
      return true
    else
      return false
  }

  getNameById(id:number){
    for(let producto of this.productos){
      if(producto.idProducto==id)
       return producto.nombreProd;
    }
    return "id no encontrado";

  }

  getCosto(idZona,idProducto){
    for(let zona of this.zonas){
      if(zona.idZona == idZona){
        for(let producto of zona.productos){
          if(producto.Producto_idProducto == idProducto){
            return producto.costoDes;
          }
        }
      }
    }
    return 0;
  }

  getTiempo(idZona,idProducto){
    for(let zona of this.zonas){
      if(zona.idZona == idZona){
        for(let producto of zona.productos){
          if(producto.Producto_idProducto == idProducto){
            return producto.tiempoDes;
          }
        }
      }
    }
    return 0;
  }

  pagarDesarrollo(){
    this.modalConfPago.hide();
    console.log(this.productoSelectedPago.idProducto)
    var costo = this.getCosto(this.productoSelectedPago.idZona,this.productoSelectedPago.idProducto);
    var x = {
      Producto_idProducto:this.productoSelectedPago.idProducto,
      Zona_idZonas:this.productoSelectedPago.idZona,
      Proyecto_idProyecto:localStorage.getItem('idProyecto'),
      Proyecto_Usuario_idUsuario:localStorage.getItem('idUsuario'),
      ultimoPeriodoDes:localStorage.getItem('numeroPeriodo')
    }
    this._desarrolloZonaService.Desarrollar(x).subscribe();
    this._desarrolloZonaService.cobrarDesarrollo(costo).subscribe();
  }

  desarrollaZona(producto){
    this.modalConfDes.hide();
    this.quitaProducto(producto.idZona,producto.idProducto);
    var x = {
      Producto_idProducto:producto.idProducto,
      Zona_idZonas:producto.idZona,
      Proyecto_idProyecto:localStorage.getItem('idProyecto'),
      Proyecto_Usuario_idUsuario:localStorage.getItem('idUsuario'),
      periodoInicio:localStorage.getItem('numeroPeriodo'),
      ultimoPeriodoDes:localStorage.getItem('numeroPeriodo')
    }
    var costo = this.getCosto(producto.idZona,producto.idProducto);
    this._desarrolloZonaService.cobrarDesarrollo(costo).subscribe();
    this._desarrolloZonaService.comenzarDesarrolloZona(x);
  }

  quitaProducto(zona,producto){
    for(let i in this.productosZonaSinDesarrollar){
      if(this.productosZonaSinDesarrollar[i].idZona==zona)
        for(let j in this.productosZonaSinDesarrollar[i].productosSinDes){
          if(this.productosZonaSinDesarrollar[i].productosSinDes[j]==producto){
            this.productosZonaSinDesarrollar[i].productosSinDes.splice(parseInt(j),1);
          }
        }
    }
  }

  confPago(idZona,idProducto){

    this.productoSelectedPago={
      idZona:idZona,
      idProducto:idProducto
    };
    console.log(this.productoSelectedPago)
    this.modalConfPago.show();
  }


  selectProductoAdd(idProducto,idZona){

    this.productoSelectedAdd={
      idProducto:idProducto,
      idZona:idZona
    };
      console.log(this.productoSelectedAdd);
  }

}
