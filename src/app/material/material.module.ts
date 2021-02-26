import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';

const Material = [
  MatButtonModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule,
  MatChipsModule,
  MatExpansionModule,
  MatButtonToggleModule,
  MatTabsModule,
  MatCardModule,
  MatIconModule,
  MatCheckboxModule,
  MatRadioModule,
];

@NgModule({
  imports: [
    Material,
  ],
  exports: [
    Material,
  ]
})
export class MaterialModule { }
