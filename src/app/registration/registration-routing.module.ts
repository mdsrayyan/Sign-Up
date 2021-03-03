import { NgModule } from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {RegistrationComponent} from './registration.component';

const routes: Route[] = [
  {path: 'sign-up', component: RegistrationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule { }
