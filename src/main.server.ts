import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/features/app.component';
import { config } from './app/features/app.config.server';

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
