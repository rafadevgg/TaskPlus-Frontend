import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { UsuarioLogin } from '../../shared/models/Auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})

export class LoginComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  loginData: UsuarioLogin = {
    email: '',
    senha: ''
  };

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (!this.loginData.email || !this.loginData.senha) {
      this.errorMessage = 'Preencha todos os campos!';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.loginData.email)) {
      this.errorMessage = 'Por favor, insira um e-mail válido!';
      return;
    }

    if (this.loginData.senha.length < 6) {
      this.errorMessage = 'A senha deve ter no mínimo 6 caracteres!';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido:', response);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro no login:', error);
        this.loading = false;

        if (error.status === 0) {
          this.errorMessage = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando!';
        } else if (error.status === 401) {
          this.errorMessage = 'E-mail ou senha incorretos!';
        } else if (error.status === 403) {
          this.errorMessage = 'Acesso negado!';
        } else {
          this.errorMessage = error.error?.message || 'Erro ao fazer login. Tente novamente!';
        }
      }
    });
  }
}