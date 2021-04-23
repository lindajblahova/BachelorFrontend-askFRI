import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
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
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatBadgeModule} from '@angular/material/badge';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatTableExporterModule } from 'mat-table-exporter';
import {MatTableModule} from '@angular/material/table';

/** Import vsetkych pouzitych modulov z kniznice Angular Material
 * zdroj: https://material.angular.io/
 */
const Material = [
  MatButtonModule,
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
  MatSelectModule,
  MatSliderModule,
  MatSidenavModule,
  MatBadgeModule,
  MatStepperModule,
  MatDialogModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTableExporterModule,
  MatTableModule
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
