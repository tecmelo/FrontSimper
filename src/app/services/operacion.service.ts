import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {BalanceService} from './balance.service';
import {ProductoService} from './producto.service';

@Injectable()
export class OperacionService {
  opAnterior = [];
  opActual = [];
  headers = new Headers({
    'Content-Type':'application/json'
  });
  productosOperacion = [];

  constructor(private http:Http, private balanceService:BalanceService,
              private productoService:ProductoService) { }

  returnProductosOperacion(){
    this.productosOperacion.length = 0;
    this.getProductosOperacion().subscribe(data => {
      for(let key$ in data.datos){
        this.productosOperacion.push(data.datos[key$]);
      }
    });
    return this.productosOperacion;
  }

  registerOperacion(idProducto,idZona,unidadesAlmacenadas,unidadesVendidas){
    var x = {
      "Producto_idProducto":idProducto,
      "Zona_idZonas":idZona,
      "Proyecto_idProyecto":localStorage.getItem('idProyecto'),
      "Usuario_idUsuario":localStorage.getItem('idUsuario'),
      "numeroPeriodo":localStorage.getItem('numeroPeriodo'),
      "unidadesAlmacenadas":unidadesAlmacenadas,
      "unidadesVendidas":unidadesVendidas
    }
    this.addOperacion(x).subscribe();
    this.sell(x).subscribe();
  }

  //Peticiones

  getProductosOperacion(){
    var x = {
      "idProyecto":localStorage.getItem('idProyecto'),
      "idUsuario":localStorage.getItem('idUsuario')
    }
    return this.http.post('http://localhost:3000/productoszonasproyectos/zonasporproducto/',x,this.headers).map(res => res.json());
  }

  sell(x){
    return this.http.post('http://localhost:3000/operacion/selling/',x,this.headers).map(res => res.json());
  }

  getAllOperaciones(){
    var x = {
      "numeroPeriodo":localStorage.getItem('numeroPeriodo'),
      "idProyecto":localStorage.getItem('idProyecto'),
      "idUsuario":localStorage.getItem('idUsuario')
    }
    return this.http.post('http://localhost:3000/operacion/getAll/',x,this.headers).map(res => res.json());
  }

  getOperacion(idProducto,numPeriodo){
    var x = {
      "idProducto":idProducto,
      "numeroPeriodo":numPeriodo,
      "idProyecto":localStorage.getItem('idProyecto'),
      "idUsuario":localStorage.getItem('idUsuario')
    }
    return this.http.post('http://localhost:3000/operacion/getOperacion/',x,this.headers).map(res => res.json());
  }

  getOperacionA(idProducto){
    var x = {
      "idProducto":idProducto,
      "numeroPeriodo":localStorage.getItem('numeroPeriodo'),
      "idProyecto":localStorage.getItem('idProyecto'),
      "idUsuario":localStorage.getItem('idUsuario')
    }
    return this.http.post('http://localhost:3000/operacion/getOperacion/',x,this.headers).map(res => res.json());
  }

  getOperacionB(idProducto){
    var x = {
      "idProducto":idProducto,
      "numeroPeriodo":parseInt(localStorage.getItem('numeroPeriodo'))-1,
      "idProyecto":localStorage.getItem('idProyecto'),
      "idUsuario":localStorage.getItem('idUsuario')
    }
    return this.http.post('http://localhost:3000/operacion/getOperacion/',x,this.headers).map(res => res.json());

  }

  cobrarVenta(p, cv, ca){
    //this.balanceService.getBalance().subscribe(data => {
      // var cobroPorVentas = ((((p.precioVenta * cv) + ((p.precioVenta * cv)*.15))/360)*30)*11;
      // var costoUniTrans = (p.costosFijosFabri + data.datos[0].depMaqEquipo + (p.costoVarUniFabri * (cv+ca)))/(cv+ca);
      // var costoTrans = (costoUniTrans * (cv+ca)) - data.datos[0].depMaqEquipo;
      // var costoTransTotal = costoTrans + (costoTrans*.15)
      //
      // var costoUniDist = (p.gastosFijosDist/cv) + p.costoVarUniDist;
      // var costoDist = cv * (costoUniDist) - p.depDistribucion;
      // var costoDistTotal = costoDist + (costoDist*.15);
      //
      // var costoUniAdmon = (p.gastosFijosAdmon/cv);
      // var costoAdmon = cv * (costoUniAdmon) - p.depAdmon;
      // var costoAdmonTotal = costoAdmon + (costoAdmon*.15);
      //
      // var compras = ((cv+ca) * p.uniMP) * p.costoUni + ((((cv+ca) * p.uniMP) * p.costoUni)*.15);
      // var compraR = (compras/)
      //
      // console.log(costoAdmon);
    this.balanceService.getBalance().subscribe(data => {
      var x = {
        utilidadEjercicio:data.datos[0].utilidadEjercicio,
        cajaBancos:data.datos[0].cajaBancos,
        cuentasPorCobrar:data.datos[0].cuentasPorCobrar,
        almacenArtTerm:data.datos[0].almacenArtTerm,
        IVAPorEnterar:data.datos[0].IVAPorEnterar,
        proveedores:data.datos[0].proveedores,
        depEdif:data.datos[0].depEdif,
        depMueblesEnseres:data.datos[0].depMueblesEnseres,
        depTerreno:data.datos[0].depTerreno,
        depEqTrans:data.datos[0].depEqTrans
      }

      x.cajaBancos -=1816550;
      x.cajaBancos +=1159583;
      x.cuentasPorCobrar += 105417;
      x.almacenArtTerm += 223267;
      x.depEdif = 15000;
      x.depMueblesEnseres = 15000;
      x.depEqTrans = 10000;
      x.IVAPorEnterar -= 7495;
      x.proveedores += 55545;
      x.utilidadEjercicio -= 416333;

      this.balanceService.editarBalance(data.datos[0].idBalance,x).subscribe(data => {
        console.log(data)
      });

    });
  }




  addOperacion(x){
    return this.http.post('http://localhost:3000/operacion/register/',x,this.headers).map(res => res.json());
  }

}
