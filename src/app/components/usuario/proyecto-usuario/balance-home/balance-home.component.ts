import { Component, OnInit } from '@angular/core';
import { DesarrolloProductoService } from '../../../../services/desarrollo-producto.service';
import { DesarrolloZonaService } from '../../../../services/desarrollo-zona.service';
import { CompraMaquinariaService } from '../../../../services/compra-maquinaria.service';
import { ProductoService } from '../../../../services/producto.service';

@Component({
  selector: 'app-balance-home',
  templateUrl: './balance-home.component.html',
  styleUrls: ['./balance-home.component.css']
})
export class BalanceHomeComponent implements OnInit {
  maquinasCompradas:any[]=[];
  productosDesarollados:any[] = [];
  productosZonaDesarrollados:any[] =[];
  productos = new Array();

  constructor(private _desarrolloProducto:DesarrolloProductoService,
              private _desarrolloZonaService:DesarrolloZonaService,
              private _CompraMaquinariaService:CompraMaquinariaService,
              private _productosService:ProductoService) {
  }

  ngOnInit() {
    this.productos = this._productosService.returnProductos();
    this.maquinasCompradas = this._CompraMaquinariaService.returnMaquinasCompradas();
    this.productosDesarollados = this._desarrolloProducto.returnProductosDesarrollados();
    this.productosZonaDesarrollados = this._desarrolloZonaService.returnProductosDeZonaDesarrollados();
  }

  getNameById(id:number){
    for(let producto of this.productos){
      if(producto.idProducto==id)
       return producto.nombreProd;
    }
    return "id no encontrado";

  }

}
