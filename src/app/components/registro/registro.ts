import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { UsuarioRegistro } from '../../shared/models/Auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.scss'
})

export class RegistroComponent {
  
  private authService = inject(AuthService);

  registroData: UsuarioRegistro = {
    nome: '',
    email: '',
    senha: ''
  };

  confirmarSenha = '';
  loading = false;
  errorMessage = '';

  onSubmit(): void {
    if (!this.registroData.nome || !this.registroData.email || !this.registroData.senha) {
      this.errorMessage = 'Preencha todos os campos!';
      return;
    }

    if (this.registroData.senha !== this.confirmarSenha) {
      this.errorMessage = 'As senhas não coincidem!';
      return;
    }

    if (this.registroData.senha.length < 6) {
      this.errorMessage = 'A senha deve ter no mínimo 6 caracteres!';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.registro(this.registroData).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Erro ao criar conta. Tente novamente!';
      }
    });
  }
}