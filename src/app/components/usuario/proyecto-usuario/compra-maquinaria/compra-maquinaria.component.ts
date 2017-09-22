import { Component, OnInit } from '@angular/core';
import {maquinaria} from '../../../../app.interfaces';
import { CompraMaquinariaService } from '../../../../services/compra-maquinaria.service';
import { MaquinariaService } from '../../../../services/maquinaria.service';
import { ProductoService } from '../../../../services/producto.service';

@Component({
  selector: 'app-compra-maquinaria',
  templateUrl: './compra-maquinaria.component.html'
})
export class CompraMaquinariaComponent implements OnInit {
  maquinas:maquinaria[]=new Array();
  productos = new Array();
  maquinasCompradas:any[]=[];
  maqSelectedAdd:any;

  constructor(private _CompraMaquinariaService:CompraMaquinariaService, private _productosService:ProductoService, private _maquinariaService:MaquinariaService) {
    this.productos = this._productosService.returnProductos();
    this.maquinas = this._maquinariaService.returnMaquinas();
    this.maquinasCompradas = this._CompraMaquinariaService.returnMaquinasCompradas();
  }

  ngOnInit() {
  }


  selectMaquinariaAdd(maquina:any){
    this.maqSelectedAdd=maquina;
    console.log(this.maqSelectedAdd)
  }


  getNameById(id:number){
    for(let producto of this.productos){
      if(producto.idProducto==id)
       return producto.nombreProd;
    }
    return "id no encontrado";

  }

  comprar(id,costo,dep){
    var x = {
      Maquinaria_idMaquinaria:id,
      Proyectos_idProyecto:parseInt(localStorage.getItem('idProyecto'))
    }

    var y = {
      Balance_numeroPeriodo:parseInt(localStorage.getItem('numeroPeriodo')),
      Proyectos_idProyecto:parseInt(localStorage.getItem('idProyecto')),
      costo:costo,
      dep:dep
    }
    this._CompraMaquinariaService.compraMaquinaria(x,y);
  }
}
