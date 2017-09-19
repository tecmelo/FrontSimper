import { Component, OnInit,ViewChild } from '@angular/core';
import {usuario} from '../../app.interfaces';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductoService} from '../../services/producto.service';
import {producto,maquinaria,select} from '../../app.interfaces';
import {MaquinariaService} from '../../services/maquinaria.service';
import {SelectModule} from 'angular2-select';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']

})

export class ProductosComponent implements OnInit {

  @ViewChild('modalEdit') public modalEdit:ModalDirective;
  @ViewChild('modalNew') public modalNew:ModalDirective;
  @ViewChild('modalConfDelete') public modalConfDelete:ModalDirective;

  public alerts: any = [];
  productos:producto[] = new Array();
  closeResult:string;
  newForm:FormGroup;
  editForm:FormGroup;
  imgDirec:string;



  productoDelete:producto={
    idProducto:0,
    nombreProd:"",
    costoDes:0,
    tiempoDes:0,
    costoProd:0,
    costoFijoFabri:0,
    costosVarFabri:0,
    costosVarUniDist:0,
    gastosFijosAdim:0,
    costosMPPUniProd:0,
    uniMP:0,
    costoUni:0
  }

/// Propuedades de Select




  constructor(private _productoService:ProductoService,
              private modalService: NgbModal,
              private _flashMessagesService: FlashMessagesService) {

      this.newForm= new FormGroup({
        'nombreProd':new FormControl('',Validators.required),
        'costoDes':new FormControl('',Validators.required),
        'tiempoDes':new FormControl('',Validators.required),
        'costoProd':new FormControl('',Validators.required),
        'costosFijosFabri':new FormControl('',Validators.required),
        'costosVarFabri':new FormControl('',Validators.required),
        'costoVarUniDist':new FormControl('',Validators.required),
        'gastosFijosAdmon':new FormControl('',Validators.required),
        'costosMPPorUniProd':new FormControl('',Validators.required),
        'uniMP':new FormControl('',Validators.required),
        'costoUni':new FormControl('',Validators.required)

      });

      this.editForm= new FormGroup({
        'idProducto':new FormControl('',Validators.required),
        'nombreProd':new FormControl('',Validators.required),
        'costoDes':new FormControl('',Validators.required),
        'tiempoDes':new FormControl('',Validators.required),
        'costoProd':new FormControl('',Validators.required),
        'costosFijosFabri':new FormControl('',Validators.required),
        'costosVarFabri':new FormControl('',Validators.required),
        'costoVarUniDist':new FormControl('',Validators.required),
        'gastosFijosAdmon':new FormControl('',Validators.required),
        'costosMPPorUniProd':new FormControl('',Validators.required),
        'uniMP':new FormControl('',Validators.required),
        'costoUni':new FormControl('',Validators.required)

      });


      this.productos=this._productoService.returnProductos();

  }

  ngOnInit(){

  }



  guarda(producto:producto){
    this._productoService.guardarProducto(producto);
    this.modalNew.hide();
    this._flashMessagesService.show('Producto "'+ producto.nombreProd + '" guardado ', { cssClass: 'alert-success' });
    this.alerts.push({
      type: 'success',
      msg: `Producto "${(producto.nombreProd)}" agregado`,
      timeout: 2000
    });

  }

  editaProducto(producto:producto){
    this._productoService.setProducto(producto).subscribe();
    this.modalEdit.hide();

    this.alerts.push({
      type: 'success',
      msg: `Producto "${(producto.nombreProd)}" editado`,
      timeout: 2000
    });

  }

  eliminaProducto(idProducto:number){
    this._productoService.deleteProducto(idProducto).subscribe();
    this.modalConfDelete.hide();

    this.alerts.push({
      type: 'danger',
      msg: `Producto Eliminado`,
      timeout: 2000
    });
  }




  openNew(){
    this.newForm.reset();
    this.modalNew.show();


  }

//Abre formulario para editar un item
openEdit(producto){
  this.modalEdit.show();
  this.editForm.setValue(producto);

}

confDelete(producto:producto){
  this.productoDelete=producto;
  console.log(this.productoDelete);
  this.modalConfDelete.show();

}

}
