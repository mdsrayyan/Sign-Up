import { NgModule } from '@angular/core';
import {Route, RouterModule} from '@angular/router';

const routes: Route[] = [
  {path: '', pathMatch: 'full', redirectTo: 'sign-up'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
