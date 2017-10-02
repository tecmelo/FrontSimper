import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FormGroup,FormControl} from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  username: String;
  password: String;
  login:FormGroup;

  constructor(
    private authService:AuthService,
    private router:Router,
  ) {

  }

  ngOnInit() {
    localStorage.clear();
    this.login= new FormGroup({
      'username':new FormControl(),
      'password':new FormControl()
    });
  }

  onLoginSubmit(){
    const datos = {
      username:this.login.controls['username'].value,
      password:this.login.controls['password'].value
    }

    this.authService.authenticateAdmin(datos).subscribe(data => {

      if(data.success){
        alert("Logeado como administrador");
        this.authService.storeAdminData(data.token, data.admin);
        this.router.navigate(['/Administrador']);
      } else {
        if(data.msg == 'Usuario No Encontrado'){
          this.authService.authenticateUsuario(datos).subscribe( data => {
            if(data.success){
              alert("Logeado como usuario");
              this.authService.storeUsuarioData(data.token, data.usuario);
              this.router.navigate(['/Usuario']);
            }
            else{
              alert(data.msg);
              this.router.navigate(['login']);
            }
          });
        }
        else{
        alert(data.msg);
        }
      }
    });
  }


}
