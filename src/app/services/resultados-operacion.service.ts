import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {ProductoVenta} from '../app.interfaces';
import {PresupuestoGlobalVentasEIVA} from '../app.interfaces';
import {AlmacenArticuloTerminadoI} from '../app.interfaces';
import {PresupuestoConsumoMP} from '../app.interfaces';
import {PresupuestoCompraMP} from '../app.interfaces';
import {PresupuestoCostoTransformacion} from '../app.interfaces';
import {PresupuestoCostoDistribucion} from '../app.interfaces';
import {PresupuestoCostoAdministracion} from '../app.interfaces';
import {costoProduccionVentas} from '../app.interfaces';
import {EstadoResultados} from '../app.interfaces';
import {PresupuestoGlobalDeProduccion} from '../app.interfaces';
import {BalanceService} from './balance.service';
import {ProductoService} from './producto.service';
import {OperacionService} from './operacion.service';

@Injectable()
export class ResultadosOperacionService {
  opAnterior = [];
  opActual = [];
  BalanceActual = [];
  productosN = [];
  productosO:ProductoVenta[] = [];

  PCA:PresupuestoCostoAdministracion = {
    unidadesAVender:null,
    costoUniTotal:null,
    costoAdministracion:null,
    depreciaciones:null,
    neto:null,
    IVA:null,
    total:null
  }

  PCD:PresupuestoCostoDistribucion = {
    unidadesAVender:null,
    costoUniTotal:null,
    costoDistribucion:null,
    depreciaciones:null,
    neto:null,
    IVA:null,
    total:null
  }

  PCT:PresupuestoCostoTransformacion = {
    unidadesAProducir:null,
    costoUniTotal:null,
    costoTrans:null,
    depreciaciones:null,
    neto:null,
    IVA:null,
    total:null
  }
  PCMP:PresupuestoCompraMP = {
    consumoMP:null,
    costoUnitarioMP:null,
    importe:null,
    IVAAcreditable:null
  }
  PGCMP:PresupuestoConsumoMP = {
    unidadesAProducir:null,
    cantidadUnitaria:null,
    costoUnitarioMP:null,
    cantidad:null,
    importe:null
  }
  PGP:PresupuestoGlobalDeProduccion = {
    unidadesAVender:null,
    inventarioFinal:null,
    inventarioInicial:null,
    unidadesAProducir:null,
    costoUnitarioMP:null,
    costoUnitarioTrans:null,
    costoProduccionUnitario:null,
    costoProduccionTotal:null
  }
  AAT:AlmacenArticuloTerminadoI = {
    unidades:null,
    costoUnitario:null,
    Total:null
  }
  PGV:PresupuestoGlobalVentasEIVA = {
    unidadesAVender:null,
    precioVenta:null,
    ventasEfe:null,
    importe:null
  }
  PAux:ProductoVenta ={
    idProducto:0,
    AlmacenArtTerminadoI:null,
    PresupuestoGlobalVentas:null,
    PresupuestoGlobalProduccion:null,
    PresupuestoConsumoMP:null,
    PresupuestoCompraMP:null,
    PresupuestoCostoTransformacion:null,
    PresupuestoCostoDistribucion:null,
    PresupuestoCostoAdministracion:null,
    costoProduccionVentas:null,
    EstadoResultados:null
  };

  constructor(private http:Http, private balanceService:BalanceService,
              private productoService:ProductoService, private operacionService:OperacionService) { }

  establecerValores(){
    this.productosO.length = 0;
    this.productosN = this.productoService.returnProductos();
    this.operacionService.getAllOperaciones().subscribe(data => {
      for(let key$ in data.datos){
        let idProducto = data.datos[key$].Producto_idProducto;
        let CV = data.datos[key$].unidadesVendidas;
        let CA = data.datos[key$].unidadesAlmacenadas;
        this.PAux.idProducto = idProducto;
        this.getAlmacenArtTerminado(idProducto);
        this.getPresupuestoGlobalDeVentasEIVA(CV,idProducto);
        this.getPresupuestoGlobaldeProduccion(idProducto);
        this.getPresupuestoGlobaldeCosumoDeMP(idProducto,CV,CA),
        this.getPresupuestoGlobaldeTransformacion(idProducto,CV,CA);
        this.getPresupuestoGlobaldeDistribucion(idProducto,CV);
        this.getPresupuestoGlobaldeAdministracion(idProducto,CV);
        this.PAux.AlmacenArtTerminadoI = this.AAT;
        this.PAux.PresupuestoGlobalVentas = this.PGV;
        this.PAux.PresupuestoGlobalProduccion = this.PGP;
        this.PAux.PresupuestoConsumoMP = this.PGCMP;
        this.PAux.PresupuestoCompraMP = this.PCMP;
        this.PAux.PresupuestoCostoTransformacion = this.PCT;
        this.PAux.PresupuestoCostoDistribucion = this.PCD;
        this.PAux.PresupuestoCostoAdministracion = this.PCA;
        console.log(this.PAux)
        this.productosO.push(this.PAux);
      }
    });
    console.log(this.productosO);
    return this.productosO;
  }

  returnValores(){
    this.establecerValores();
    return this.productosO;
  }

  getPresupuestoGlobalDeVentasEIVA(unidadesV,idProducto){
    this.PGV.unidadesAVender = unidadesV;
    var p = this.getProducto(idProducto);
    this.PGV.precioVenta = p.precioVenta;
    this.PGV.ventasEfe = p.precioVenta * unidadesV;
    this.PGV.importe = (this.PGV.ventasEfe * .15);
    return this.PGV;
  }

  getAlmacenArtTerminado(idProducto){
    this.getAlmacenArtTerminadoAnterior(idProducto);
    this.getUnidadesAlmacenadasAnterior(idProducto);
    if(this.AAT.Total != 0){
      this.AAT.costoUnitario = this.AAT.Total/this.AAT.unidades;
    }
    else{
      this.AAT.costoUnitario = 0;
    }
    return this.AAT;
  }

  getUnidadesAlmacenadasAnterior(idProducto){
    if(localStorage.getItem('numeroPeriodo') == "1"){
      this.AAT.unidades = 0;
    }
    else{
      var numP = parseInt(localStorage.getItem('numeroPeriodo')) - 1;
      this.operacionService.getOperacion(idProducto,numP).subscribe(data => {
        this.AAT.unidades = data.datos[0].unidadesAlmacenadas;
      });
    }
  }

  getAlmacenArtTerminadoAnterior(idProducto){
    if(localStorage.getItem('numeroPeriodo') == "1"){
      this.AAT.Total = 0;
    }
    else{
      this.AAT.Total = 0;
    }
  }

  getPresupuestoGlobaldeProduccion(idProducto){
    this.PGP.unidadesAVender = this.PGV.unidadesAVender;
    this.operacionService.getOperacionA(idProducto).subscribe(data => {
      this.PGP.inventarioFinal = data.datos[0].unidadesAlmacenadas;
      this.operacionService.getOperacionB(idProducto).subscribe(data => {

        if(localStorage.getItem('numeroPeriodo') != "1"){
          this.PGP.inventarioInicial = data.datos[0].unidadesAlmacenadas;
        }
        else{
          this.PGP.inventarioInicial = 0;
        }

        this.PGP.unidadesAProducir = this.PGP.unidadesAVender + this.PGP.inventarioFinal - this.PGP.inventarioInicial;
        var p = this.getProducto(idProducto);
        this.PGP.costoUnitarioMP = p.costosMPPUniProd;

        this.balanceService.getBalance().subscribe(data => {
          this.PGP.costoUnitarioTrans = (p.costosFijosFabri + data.datos[0].depMaqEquipo + (p.costoVarUniFabri * this.PGP.unidadesAProducir))/this.PGP.unidadesAProducir;
          this.PGP.costoProduccionUnitario = this.PGP.costoUnitarioMP + this.PGP.costoUnitarioTrans;
          this.PGP.costoProduccionTotal = this.PGP.costoProduccionUnitario * this.PGP.unidadesAProducir;
        });
      });
    });
  }

  getPresupuestoGlobaldeCosumoDeMP(idProducto,cv,ca){
    this.operacionService.getOperacionA(idProducto).subscribe(data => {
      this.PGCMP.unidadesAProducir = cv+ca;
      this.operacionService.getOperacionB(idProducto).subscribe(data => {
        if(localStorage.getItem('numeroPeriodo') != "1"){
          this.PGCMP.unidadesAProducir += data.datos[0].unidadesAlmacenadas;
        }
        else{
          this.PGCMP.unidadesAProducir += 0;
        }
        var p = this.getProducto(idProducto);
        this.PGCMP.cantidadUnitaria = p.uniMP;
        this.PGCMP.costoUnitarioMP = p.costoUni;
        this.PGCMP.cantidad = this.PGCMP.cantidadUnitaria * this.PGCMP.unidadesAProducir;
        this.PGCMP.importe = this.PGCMP.costoUnitarioMP * this.PGCMP.cantidad;

        //Compra MP
        this.PCMP.consumoMP = this.PGCMP.cantidad;
        this.PCMP.costoUnitarioMP = this.PGCMP.costoUnitarioMP;
        this.PCMP.importe = this.PGCMP.importe;
        this.PCMP.IVAAcreditable = this.PCMP.importe*.15;
      });
    });
  }

  getPresupuestoGlobaldeTransformacion(idProducto,cv,ca){
    this.operacionService.getOperacionA(idProducto).subscribe(data => {
      this.PCT.unidadesAProducir = cv+ca;
      this.operacionService.getOperacionB(idProducto).subscribe(data => {
        if(localStorage.getItem('numeroPeriodo') != "1"){
          this.PCT.unidadesAProducir += data.datos[0].unidadesAlmacenadas;
        }
        else{
          this.PCT.unidadesAProducir += 0;
        }
        var p = this.getProducto(idProducto);

        this.balanceService.getBalance().subscribe(data => {
          this.PCT.costoUniTotal = (p.costosFijosFabri + data.datos[0].depMaqEquipo + (p.costoVarUniFabri * this.PCT.unidadesAProducir))/this.PCT.unidadesAProducir;
          this.PCT.costoTrans = this.PCT.costoUniTotal * this.PCT.unidadesAProducir;
          this.PCT.depreciaciones = data.datos[0].depMaqEquipo;
          this.PCT.neto = this.PCT.costoTrans - this.PCT.depreciaciones;
          this.PCT.IVA = this.PCT.neto*.15;
          this.PCT.total= this.PCT.IVA + this.PCT.neto;
        });

      });
    });
  }

  getPresupuestoGlobaldeDistribucion(idProducto,cv){
    var p = this.getProducto(idProducto);
    this.PCD.unidadesAVender = cv;
    this.PCD.costoUniTotal = (p.gastosFijosDist/cv)+p.costoVarUniDist;
    this.PCD.costoDistribucion = cv * this.PCD.costoUniTotal;
    this.PCD.depreciaciones = p.depDistribucion;
    this.PCD.neto = this.PCD.costoDistribucion - this.PCD.depreciaciones;
    this.PCD.IVA = this.PCD.neto * .15;
    this.PCD.total = this.PCD.neto + this.PCD.IVA;
  }

  getPresupuestoGlobaldeAdministracion(idProducto,cv){
    var p = this.getProducto(idProducto);
    this.PCA.unidadesAVender = cv;
    this.PCA.costoUniTotal = (p.gastosFijosAdmon/cv);
    this.PCA.costoAdministracion = cv * this.PCA.costoUniTotal;
    this.PCA.depreciaciones = p.depAdmon;
    this.PCA.neto = this.PCA.costoAdministracion - this.PCA.depreciaciones;
    this.PCA.IVA = this.PCA.neto * .15;
    this.PCA.total = this.PCA.neto + this.PCA.IVA;
  }




  getProducto(idProducto){
    var prod = null;
    for(let producto of this.productosN){
      if(producto.idProducto == idProducto){
        prod = producto;
        break;
      }
    }
    return prod;
  }

}
