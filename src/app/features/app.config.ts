import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from '../core/interceptors/auth-interceptor';



const firebaseConfig = {
  apiKey: "AIzaSyAHfTgwgSamL-iR3PT4lqZZ219aqWZ-PZE",
  authDomain: "todolist-dd189.firebaseapp.com",
  projectId: "todolist-dd189",
  storageBucket: "todolist-dd189.firebasestorage.app",
  messagingSenderId: "324313137657",
  appId: "1:324313137657:web:772e9493deb8253d883d28",
  measurementId: "G-S2HD0VJNKD"
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({
        paramsInheritanceStrategy: 'always'
      })
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([tokenInterceptor]))
  ]
};

