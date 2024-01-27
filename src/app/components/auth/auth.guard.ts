import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  //Inject services
  const _authService = inject(AuthService);
  const _router = inject(Router);

  //calling authService!
  //using pipe to directly get value of observable without suscribing
  return _authService.isLoggedIn$.pipe(map((res:boolean)=>{
    console.log('AuthGuard -> isLoggedIn: ',res);

    //if BehaviourSubject (isLoggedIn:true -> authenticate user | Else authentication fails
    if(!res){
      _router.navigate(['auth/login']);
      return false;
    }
    return true;
  }))
};
