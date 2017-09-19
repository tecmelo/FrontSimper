import { Component, OnInit } from '@angular/core';
import { ResultadosOperacionService} from '../../../../services/resultados-operacion.service';
import {ProductoService} from '../../../../services/producto.service';
import {ProductoVenta} from '../../../../app.interfaces';
import {PresupuestoGlobalVentasEIVA} from '../../../../app.interfaces';
import {AlmacenArticuloTerminadoI} from '../../../../app.interfaces';
import {PresupuestoConsumoMP} from '../../../../app.interfaces';
import {PresupuestoCompraMP} from '../../../../app.interfaces';
import {PresupuestoCostoTransformacion} from '../../../../app.interfaces';
import {PresupuestoCostoDistribucion} from '../../../../app.interfaces';
import {PresupuestoCostoAdministracion} from '../../../../app.interfaces';
import {costoProduccionVentas} from '../../../../app.interfaces';
import {EstadoResultados} from '../../../../app.interfaces';
import {PresupuestoGlobalDeProduccion} from '../../../../app.interfaces';

@Component({
  selector: 'app-operacion',
  templateUrl: './operacion.component.html',
  styleUrls: ['./operacion.component.css']
})
export class OperacionComponent implements OnInit {
  productosO:ProductoVenta[] = [];
  productos=[];

  constructor(private _RoperacionService:ResultadosOperacionService,private _productoService:ProductoService) {
    this.productos=this._productoService.returnProductos();
    this.productosO = this._RoperacionService.returnValores();
  }

  ngOnInit() {
  }

  getNameByIdProducto(id:number){
    for(let producto of this.productos){
      if(producto.idProducto==id)
       return producto.nombreProd;
    }
    return "id no encontrado";

  }


}
