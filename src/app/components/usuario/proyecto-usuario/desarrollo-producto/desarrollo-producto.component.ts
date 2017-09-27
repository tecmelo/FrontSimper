import { Component, OnInit, ViewChild } from '@angular/core';
import { DesarrolloProductoService } from '../../../../services/desarrollo-producto.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-desarrollo-producto',
  templateUrl: './desarrollo-producto.component.html',
  styleUrls: ['./desarrollo-producto.component.css']
})
export class DesarrolloProductoComponent implements OnInit {
  productosDesarollados:any[] = [];
  productosEnDesarrollo:any[] = [];
  productosSinDesarrollar:any[] = [];
  productoSelectedAdd:any;
  productoSelectedPago={
    id:null,
    costo:null
  };

  @ViewChild('modalConfDes') public modalConfDes:ModalDirective;
  @ViewChild('modalConfPago') public modalConfPago:ModalDirective;

  constructor(private _desarrolloProducto:DesarrolloProductoService) {
    this.productosSinDesarrollar = this._desarrolloProducto.returnProductosSinDesarrollar();
    this.productosEnDesarrollo = this._desarrolloProducto.returnProductosEnDesarrollo();
    this.productosDesarollados = this._desarrolloProducto.returnProductosDesarrollados();
    setTimeout(() => {
     this.productoSelectedAdd=this.productosSinDesarrollar[0];
   }, 2000);

   }

  ngOnInit() {
  }

  desarrollar(){
      this._desarrolloProducto.comenzarDesarrollo(this.productoSelectedAdd.idProducto,this.productoSelectedAdd.costoDes);
      this.modalConfDes.hide();
  }

  pagarDesarrollo(){
    this._desarrolloProducto.pagarDesarrollo(this.productoSelectedPago.id,this.productoSelectedPago.costo)
  }

  confPago(id,costo){
    this.productoSelectedPago={
      id:id,
      costo:costo
    }
    console.log(this.productoSelectedPago);
    this.modalConfPago.show()
  }



  selectProducto(producto){
    console.log(producto)
    this.productoSelectedAdd=producto;


  }

}
