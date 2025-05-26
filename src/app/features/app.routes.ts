import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { authGuard } from '../core/guards/auth.guard';
import { SignupFormComponent } from './auth/multistep-signup/signup-form/signup-form.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupFormComponent
    },
    {
        path: 'user/:userId/todos',
        loadComponent: () => import('./todo-list/todo-list.component').then(m => m.TodoListComponent),
        canActivate: [authGuard]
    },
    { 
        path: '**', 
        redirectTo: 'login' 
    }
];
