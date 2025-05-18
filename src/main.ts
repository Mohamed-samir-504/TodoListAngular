import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/features/app.component';
import { appConfig } from './app/features/app.config';

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));