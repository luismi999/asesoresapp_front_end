import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ChartModule } from 'primeng/chart';
import { ConfirmDialogModule } from 'primeng/confirmdialog'; 
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectButtonModule } from 'primeng/selectbutton';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    ChartModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    ProgressBarModule,
    SelectButtonModule
  ],
  exports: [
    ButtonModule,
    ToastModule,
    DialogModule,
    ChartModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    ProgressBarModule,
    SelectButtonModule
  ]
})
export class PrimengModule { }
