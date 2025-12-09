import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { TarefaService } from '../../services/tarefa-service';
import { CategoriaService } from '../../services/categoria-service';
import { Tarefa, TarefaRequest, Categoria } from '../../shared/models/Tarefa';

@Component({
  selector: 'app-minhas-tarefas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './minhas-tarefas.html',
  styleUrl: './minhas-tarefas.scss'
})

export class MinhasTarefas implements OnInit {

  authService = inject(AuthService);
  private router = inject(Router);
  private tarefaService = inject(TarefaService);
  private categoriaService = inject(CategoriaService);

  tarefas = signal<Tarefa[]>([]);
  categorias = signal<Categoria[]>([]);

  showModal = false;
  editMode = false;

  novaTarefa: TarefaRequest = {
    nmTarefa: '',
    dlTarefa: '',
    cdCategoria: undefined
  };

  tarefaEditando: Tarefa | null = null;

  filtroAtivo: 'todas' | 'pendentes' | 'concluidas' = 'todas';

  ngOnInit(): void {
    this.carregarTarefas();
    this.carregarCategorias();
  }

  carregarTarefas(): void {
    this.tarefaService.listarTodas().subscribe({
      next: (tarefas) => this.tarefas.set(tarefas),
      error: (error) => console.error('Erro ao carregar tarefas:', error)
    });
  }

  carregarCategorias(): void {
    this.categoriaService.listarTodas().subscribe({
      next: (categorias) => this.categorias.set(categorias),
      error: (error) => console.error('Erro ao carregar categorias:', error)
    });
  }

  get tarefasFiltradas(): Tarefa[] {
    const todas = this.tarefas();

    switch (this.filtroAtivo) {
      case 'pendentes':
        return todas.filter(t => t.stTarefa === 'PENDENTE');
      case 'concluidas':
        return todas.filter(t => t.stTarefa === 'CONCLUÍDA');
      default:
        return todas;
    }
  }

  abrirModal(): void {
    this.editMode = false;
    this.novaTarefa = {
      nmTarefa: '',
      dlTarefa: '',
      cdCategoria: undefined
    };
    this.showModal = true;
  }

  abrirModalEdicao(tarefa: Tarefa): void {
    this.editMode = true;
    this.tarefaEditando = tarefa;
    this.novaTarefa = {
      nmTarefa: tarefa.nmTarefa,
      dlTarefa: tarefa.dlTarefa.split('T')[0] + 'T' + tarefa.dlTarefa.split('T')[1]?.substring(0, 5) || '',
      cdCategoria: tarefa.categoria?.cdCategoria
    };
    this.showModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
    this.editMode = false;
    this.tarefaEditando = null;
  }

  salvarTarefa(): void {
    if (!this.novaTarefa.nmTarefa || !this.novaTarefa.dlTarefa) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    const dataFormatada = this.novaTarefa.dlTarefa;

    const tarefaRequest: TarefaRequest = {
      ...this.novaTarefa,
      dlTarefa: dataFormatada
    };

    if (this.editMode && this.tarefaEditando) {
      this.tarefaService.atualizar(this.tarefaEditando.cdTarefa!, tarefaRequest).subscribe({
        next: () => {
          this.carregarTarefas();
          this.fecharModal();
        },
        error: (error) => alert('Erro ao atualizar tarefa: ' + error.error?.message)
      });
    } else {
      this.tarefaService.criar(tarefaRequest).subscribe({
        next: () => {
          this.carregarTarefas();
          this.fecharModal();
        },
        error: (error) => alert('Erro ao criar tarefa: ' + error.error?.message)
      });
    }
  }

  concluirTarefa(id: number): void {
    this.tarefaService.concluir(id).subscribe({
      next: () => this.carregarTarefas(),
      error: (error) => alert('Erro ao concluir tarefa')
    });
  }

  adiarTarefa(id: number): void {
    this.tarefaService.adiar(id).subscribe({
      next: () => this.carregarTarefas(),
      error: (error) => alert('Erro ao adiar tarefa')
    });
  }

  deletarTarefa(id: number): void {
    if (confirm('Deseja realmente excluir esta tarefa?')) {
      this.tarefaService.deletar(id).subscribe({
        next: () => this.carregarTarefas(),
        error: (error) => alert('Erro ao deletar tarefa')
      });
    }
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  logout(): void {
    this.authService.logout();
  }

  voltar(): void {
    this.router.navigate(['/dashboard']);
  }

}