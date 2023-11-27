import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      // si hay usuario logeado me va a dejar entrar al apartado de home, si no esta logeado lo redirige al apartado de login
      let user = localStorage.getItem('user');
   
      return new Promise((resolve) => {
        this.firebaseSvc.getAuth().onAuthStateChanged((auth) => {
          if(auth) {
  	       if(user) resolve(true);
          }
          else{
            this.firebaseSvc.signOut();
            resolve(false);
          }
        })
      });
  }
  
}
