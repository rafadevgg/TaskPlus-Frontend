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

  onSubmit(): void {
    if (!this.loginData.email || !this.loginData.senha) {
      this.errorMessage = 'Preencha todos os campos!';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Email ou senha incorretos!';
      }
    });
  }
}