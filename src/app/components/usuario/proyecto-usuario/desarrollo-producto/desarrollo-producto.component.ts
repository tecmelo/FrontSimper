import { Component, OnInit } from '@angular/core';
import { DesarrolloProductoService } from '../../../../services/desarrollo-producto.service';

@Component({
  selector: 'app-desarrollo-producto',
  templateUrl: './desarrollo-producto.component.html',
  styleUrls: ['./desarrollo-producto.component.css']
})
export class DesarrolloProductoComponent implements OnInit {
  productosDesarollados:any[] = [];
  productosEnDesarrollo:any[] = [];
  productosSinDesarrollar:any[] = [];
  productoSelected:any;

  constructor(private _desarrolloProducto:DesarrolloProductoService) {
    this.productosSinDesarrollar = this._desarrolloProducto.returnProductosSinDesarrollar();
    this.productosEnDesarrollo = this._desarrolloProducto.returnProductosEnDesarrollo();
    this.productosDesarollados = this._desarrolloProducto.returnProductosDesarrollados();
   }

  ngOnInit() {
  }

  desarrollar(){
      this._desarrolloProducto.comenzarDesarrollo(this.productoSelected.idProducto,this.productoSelected.costoDes);
  }

  pagarDesarrollo(id,costo){
    this._desarrolloProducto.pagarDesarrollo(id,costo)
  }

  selectProducto(producto){
    this.selectProducto=producto;

  }

}
