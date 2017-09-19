import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';
import 'rxjs/Rx';


@Injectable()
export class AuthService {
  authToken: any;
  admin: any;
  usuario: any;

  constructor(private http:Http) { }

  registerAdmin(admin){
    let headers = new Headers({
      'Content-Type':'application/json'
    });
    return this.http.post('http://localhost:3000/admin/register', admin, {headers})
        .map(res => {return res.json();
        });
  }

  authenticateAdmin(datos){
    let headers = new Headers({
      'Content-Type':'application/json'
    });
    return this.http.post('http://localhost:3000/admin/authenticate', datos, {headers})
    .map( res => {
      return res.json();
    });
  }

  authenticateUsuario(datos){
    let headers = new Headers({
      'Content-Type':'application/json'
    });
    return this.http.post('http://localhost:3000/usuario/authenticate', datos, {headers})
    .map( res => {
      return res.json();
    });
  }

  getProfileAdmin(){
    let headers = new Headers({
      'Content-Type':'application/json'
    });
    this.loadToken();
    headers.append('Authorization',this.authToken);
    return this.http.get('http://localhost:3000/admin/profile', {headers}).map( res => res.json());
  }

  getProfileUsuario(){
    let headers = new Headers({
      'Content-Type':'application/json'
    });
    this.loadToken();
    headers.append('Authorization',this.authToken);
    return this.http.get('http://localhost:3000/admin/profile', {headers}).map( res => res.json());
  }

  storeAdminData(token, admin){
    localStorage.setItem('id_token', token);
    localStorage.setItem('idAdmin', admin.id);
    localStorage.setItem('nombreAdmin', admin.name);
    this.authToken = token;
    this.admin = admin;
  }

  storeUsuarioData(token, usuario){
    localStorage.setItem('id_token', token);
    localStorage.setItem('idUsuario', usuario.id);
    localStorage.setItem('nombreUsuario', usuario.name);
    this.authToken = token;
    this.usuario = usuario;
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn(){
    if(this.authToken){
      return true;
    }
    else{
      return false;
    }
  }

  logoutAdmin(){
    this.authToken = null;
    this.admin = null;
    localStorage.clear();
  }

  logoutUsuario(){
    this.authToken = null;
    this.usuario = null;
    localStorage.clear();
  }

}
