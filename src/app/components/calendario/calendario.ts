import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { TarefaService } from '../../services/tarefa-service';
import { Tarefa } from '../../shared/models/Tarefa';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendario.html',
  styleUrl: './calendario.scss'
})

export class Calendario implements OnInit {

  authService = inject(AuthService);
  private router = inject(Router);
  private tarefaService = inject(TarefaService);

  tarefas = signal<Tarefa[]>([]);
  mesAtual: Date = new Date();
  diasDoMes: any[] = [];
  diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  ngOnInit(): void {
    this.carregarTarefas();
    this.gerarCalendario();
  }

  carregarTarefas(): void {
    this.tarefaService.listarTodas().subscribe({
      next: (tarefas) => {
        this.tarefas.set(tarefas);
        this.gerarCalendario();
      },
      error: (error) => console.error('Erro ao carregar tarefas:', error)
    });
  }

  gerarCalendario(): void {
    const ano = this.mesAtual.getFullYear();
    const mes = this.mesAtual.getMonth();

    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);

    const diasAnteriores = primeiroDia.getDay();
    const diasNoMes = ultimoDia.getDate();

    this.diasDoMes = [];

    for (let i = diasAnteriores - 1; i >= 0; i--) {
      const diaAnterior = new Date(ano, mes, -i);
      this.diasDoMes.push({
        data: diaAnterior,
        dia: diaAnterior.getDate(),
        mesAtual: false,
        tarefas: this.getTarefasDoDia(diaAnterior)
      });
    }

    for (let dia = 1; dia <= diasNoMes; dia++) {
      const dataAtual = new Date(ano, mes, dia);
      this.diasDoMes.push({
        data: dataAtual,
        dia: dia,
        mesAtual: true,
        hoje: this.isHoje(dataAtual),
        tarefas: this.getTarefasDoDia(dataAtual)
      });
    }

    const diasRestantes = 42 - this.diasDoMes.length;
    for (let dia = 1; dia <= diasRestantes; dia++) {
      const proximaData = new Date(ano, mes + 1, dia);
      this.diasDoMes.push({
        data: proximaData,
        dia: dia,
        mesAtual: false,
        tarefas: this.getTarefasDoDia(proximaData)
      });
    }
  }

  getTarefasDoDia(data: Date): Tarefa[] {
    return this.tarefas().filter(tarefa => {
      const tarefaData = new Date(tarefa.dlTarefa);
      return tarefaData.getDate() === data.getDate() &&
        tarefaData.getMonth() === data.getMonth() &&
        tarefaData.getFullYear() === data.getFullYear();
    });
  }

  isHoje(data: Date): boolean {
    const hoje = new Date();
    return data.getDate() === hoje.getDate() &&
      data.getMonth() === hoje.getMonth() &&
      data.getFullYear() === hoje.getFullYear();
  }

  mesAnterior(): void {
    this.mesAtual = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth() - 1, 1);
    this.gerarCalendario();
  }

  proximoMes(): void {
    this.mesAtual = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth() + 1, 1);
    this.gerarCalendario();
  }

  mesAtualTexto(): string {
    return `${this.meses[this.mesAtual.getMonth()]} ${this.mesAtual.getFullYear()}`;
  }

  voltar(): void {
    this.router.navigate(['/dashboard']);
  }
}