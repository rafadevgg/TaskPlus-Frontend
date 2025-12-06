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
    console.log('Tentando submeter:', this.registroData);

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
      next: (response) => {
        console.log('Registro bem-sucedido:', response);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro completo:', error);
        console.error('Erro status:', error.status);
        console.error('Erro mensagem:', error.error);

        this.loading = false;

        if (error.status === 0) {
          this.errorMessage = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando!';
        } else if (error.status === 400) {
          this.errorMessage = error.error?.message || 'Dados inválidos!';
        } else if (error.status === 409) {
          this.errorMessage = 'Email já cadastrado!';
        } else {
          this.errorMessage = error.error?.message || 'Erro ao criar conta. Tente novamente!';
        }
      }
    });
  }
}