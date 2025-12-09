import { Routes } from '@angular/router';
import { authGuard } from './services/auth-guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./views/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () => import('./components/registro/registro').then(m => m.RegistroComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./views/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'minhas-tarefas',
    loadComponent: () => import('./components/minhas-tarefas/minhas-tarefas').then(m => m.MinhasTarefas),
    canActivate: [authGuard]
  },
  {
    path: 'calendario',
    loadComponent: () => import('./components/calendario/calendario').then(m => m.Calendario),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];