import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// firebase
import { AngularFireModule } from '@angular/fire/compat'
import { environment } from 'src/environments/environment';
import firebase from 'firebase/compat/app';
import 'firebase/compat/app';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
// import { provideAuth, getAuth } from '@angular/fire/auth';
// import { getFirestore, provideFirestore } from '@angular/fire/firestore';

firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [AppComponent],
  imports: [
  BrowserModule,
  IonicModule.forRoot({mode: 'md'}),
  AppRoutingModule,
  AngularFireModule.initializeApp(environment.firebase),
  AngularFireStorageModule,
],

  providers: [{
    provide: RouteReuseStrategy,
    useClass: IonicRouteStrategy,
  }],
  bootstrap: [AppComponent],
  })
export class AppModule {}
