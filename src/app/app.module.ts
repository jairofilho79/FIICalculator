import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DinheiroPipe } from './home/dinheiro.pipe';
import { ShowResultsComponent } from './home/show-results/show-results.component';
import { ChipComponent } from './home/chip/chip.component';
import { MonthToYearPipe } from './home/month-to-year.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DinheiroPipe,
    ShowResultsComponent,
    ChipComponent,
    MonthToYearPipe
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
