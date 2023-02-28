import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

const MATERIAL_IMPORTS = [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
];

@NgModule({
  imports: MATERIAL_IMPORTS,
  exports: MATERIAL_IMPORTS,
})
export class MaterialProxyModule { }
