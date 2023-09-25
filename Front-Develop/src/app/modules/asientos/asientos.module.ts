import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsientosRoutingModule } from './asientos-routing.module';
import { AsientosListComponent } from './asientos-list/asientos-list/asientos-list.component';
import { AsientosDetailComponent } from './asientos-detail/asientos-detail/asientos-detail.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  declarations: [
    AsientosListComponent,
    AsientosDetailComponent
  ],
  imports: [
    CommonModule,
    AsientosRoutingModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule
  ]
})
export class AsientosModule { }
