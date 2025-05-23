import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from '../core/guards/auth.guard';

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
        component: SignupComponent
    },
    {
        path: 'user/:userId/todos',
        loadComponent: () => import('./todo-list/todo-list.component').then(m => m.TodoListComponent),
        canActivate: [AuthGuard]
    },
    { 
        path: '**', 
        redirectTo: 'login' 
    }
];
