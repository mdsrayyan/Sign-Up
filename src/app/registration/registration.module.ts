import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegistrationComponent} from './registration.component';
import {SharedModule} from '../shared/shared.module';
import {RegistrationRoutingModule} from './registration-routing.module';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import {MatProgressBarModule} from '@angular/material/progress-bar';


@NgModule({
  declarations: [RegistrationComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    RegistrationRoutingModule,
    SharedModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressBarModule
  ],
  exports: [
  ]
})
export class RegistrationModule {
}
