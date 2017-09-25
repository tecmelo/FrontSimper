import { Component, OnInit } from '@angular/core';
import {maquinaria} from '../../../../app.interfaces';
import { CompraMaquinariaService } from '../../../../services/compra-maquinaria.service';
import { MaquinariaService } from '../../../../services/maquinaria.service';
import { ProductoService } from '../../../../services/producto.service';

@Component({
  selector: 'app-compra-maquinaria',
  templateUrl: './compra-maquinaria.component.html',
  styleUrls: ['./compra-maquinaria.component.css']
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
    setTimeout(() => {
     this.maqSelectedAdd=this.maquinas[0];
   }, 2000);

    console.log(this.maqSelectedAdd);
  }

  ngOnInit() {
  }

  comprueba(maquina){
    if(maquina.idMaquinaria==this.maqSelectedAdd.idMaquinaria){
      return true;

    }

    else{
      return false
    }
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

  comprar(id,producto,costo,dep){
    var x = {
      Balance_numeroPeriodo:parseInt(localStorage.getItem('numeroPeriodo')),
      Maquinaria_idMaquinaria:id,
      Producto_idProducto:producto,
      Proyectos_idProyecto:parseInt(localStorage.getItem('idProyecto'))
    }

    this._CompraMaquinariaService.compraMaquinaria(x,costo,dep);
  }
}
