import { Component, OnInit } from '@angular/core';
import {ZonasService} from '../../../../services/zonas.service';
import {ProductoService} from '../../../../services/producto.service';
import {DesarrolloZonaService} from '../../../../services/desarrollo-zona.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {producto} from '../../../../app.interfaces';

@Component({
  selector: 'app-desarrollo-mercado',
  templateUrl: './desarrollo-mercado.component.html',
  styleUrls: ['./desarrollo-mercado.component.css']
})
export class DesarrolloMercadoComponent implements OnInit {

  zonas=[]
  productos:producto[]=[];
  productosZonaSinDesarrollar:any[] = [];
  productosZonaEnDesarrollo: any[] = [];
  productosZonaDesarrollados: any[] = [];
  zonaForm:FormGroup;

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
   }

  ngOnInit() {
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

  pagarDesarrollo(idZona,idProducto){
    var costo = this.getCosto(idZona,idProducto[0]);
    var x = {
      Producto_idProducto:idProducto[0],
      Zona_idZonas:idZona,
      Proyecto_idProyecto:localStorage.getItem('idProyecto'),
      Proyecto_Usuario_idUsuario:localStorage.getItem('idUsuario'),
      ultimoPeriodoDes:localStorage.getItem('numeroPeriodo')
    }
    this._desarrolloZonaService.Desarrollar(x).subscribe();
    this._desarrolloZonaService.cobrarDesarrollo(costo).subscribe();
  }

  desarrollaZona(idZona,formZona){
    this.quitaProducto(idZona,formZona);
    var x = {
      Producto_idProducto:formZona.idProducto,
      Zona_idZonas:idZona,
      Proyecto_idProyecto:localStorage.getItem('idProyecto'),
      Proyecto_Usuario_idUsuario:localStorage.getItem('idUsuario'),
      periodoInicio:localStorage.getItem('numeroPeriodo'),
      ultimoPeriodoDes:localStorage.getItem('numeroPeriodo')
    }
    var costo = this.getCosto(idZona,formZona.idProducto);
    this._desarrolloZonaService.cobrarDesarrollo(costo).subscribe();
    this._desarrolloZonaService.comenzarDesarrolloZona(x);
  }

  quitaProducto(zona,producto){
    for(let i in this.productosZonaSinDesarrollar){
      if(this.productosZonaSinDesarrollar[i].idZona==zona)
        for(let j in this.productosZonaSinDesarrollar[i].productosSinDes){
          if(this.productosZonaSinDesarrollar[i].productosSinDes[j]==producto.idProducto){
            this.productosZonaSinDesarrollar[i].productosSinDes.splice(parseInt(j),1);
          }
        }
    }
  }

}
