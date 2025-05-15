import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { SignupComponent } from './auth/signup/signup.component';

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
        path: 'todos',
        component: TodoListComponent
    },
];
