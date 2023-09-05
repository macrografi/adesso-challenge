import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UnitsComponent } from './units/units.component';
import { HeaderComponent } from './shared/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { MockApi } from './api/mock-api';
import { UnitsService } from './service/units.service';
import { NgxsModule } from '@ngxs/store';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { UnitsState } from './state/units.state';
import { FooterComponent } from './shared/footer/footer.component';
import {FormsModule} from "@angular/forms";
import { UnitDetailComponent } from './units/unit-detail/unit-detail.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, UnitsComponent, HeaderComponent, FooterComponent, UnitDetailComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        NgxsModule.forRoot([UnitsState]),
        NgxsDispatchPluginModule.forRoot(),
        NgxsReduxDevtoolsPluginModule.forRoot(),
        InMemoryWebApiModule.forRoot(MockApi),
        FormsModule
    ],
  providers: [UnitsService],
  bootstrap: [AppComponent]
})
export class AppModule {}
