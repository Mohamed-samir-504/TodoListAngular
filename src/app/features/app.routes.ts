import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { authGuard } from '../core/guards/auth.guard';
import { DummyTodosComponent } from './backend-todos/dummy-todos/dummy-todos.component';

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
        canActivate: [authGuard]
    },
    {
        path: 'backend/todos',
        loadComponent: () => import('./backend-todos/dummy-todos/dummy-todos.component').then(m => m.DummyTodosComponent),
    },
    { 
        path: '**', 
        redirectTo: 'login' 
    }
];
