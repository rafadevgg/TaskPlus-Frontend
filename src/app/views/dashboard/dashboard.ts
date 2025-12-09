import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { TarefaService } from '../../services/tarefa-service';
import { CategoriaService } from '../../services/categoria-service';
import { Tarefa, TarefaRequest, Categoria } from '../../shared/models/Tarefa';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})

export class DashboardComponent implements OnInit {

  authService = inject(AuthService);
  private router = inject(Router);
  private tarefaService = inject(TarefaService);
  private categoriaService = inject(CategoriaService);

  tarefas = signal<Tarefa[]>([]);
  categorias = signal<Categoria[]>([]);

  showModal = false;
  showCategoriaModal = false;
  showNotifications = false;
  editMode = false;

  novaTarefa: TarefaRequest = {
    nmTarefa: '',
    dlTarefa: '',
    cdCategoria: undefined
  };

  tarefaEditando: Tarefa | null = null;

  novaCategoria = {
    nmCategoria: ''
  };

  filtroAtivo: 'todas' | 'pendentes' | 'concluidas' = 'todas';
  viewAtiva: 'dashboard' | 'tarefas' | 'categorias' | 'calendario' = 'dashboard';

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

  navegarPara(view: 'dashboard' | 'tarefas' | 'categorias' | 'calendario'): void {
    this.viewAtiva = view;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
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

  get estatisticas() {
    const todas = this.tarefas();
    return {
      total: todas.length,
      pendentes: todas.filter(t => t.stTarefa === 'PENDENTE').length,
      concluidas: todas.filter(t => t.stTarefa === 'CONCLUÍDA').length,
      adiadas: todas.filter(t => t.adiado === 'Sim').length
    };
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

  abrirCategoriaModal(): void {
    this.novaCategoria.nmCategoria = '';
    this.showCategoriaModal = true;
  }

  fecharCategoriaModal(): void {
    this.showCategoriaModal = false;
  }

  salvarCategoria(): void {
    if (!this.novaCategoria.nmCategoria) {
      alert('Digite o nome da categoria!');
      return;
    }

    this.categoriaService.criar(this.novaCategoria).subscribe({
      next: () => {
        this.carregarCategorias();
        this.novaCategoria.nmCategoria = '';
      },
      error: (error) => alert('Erro ao criar categoria')
    });
  }

  deletarCategoria(id: number): void {
    if (confirm('Deseja realmente excluir esta categoria?')) {
      this.categoriaService.deletar(id).subscribe({
        next: () => this.carregarCategorias(),
        error: (error) => alert('Erro ao deletar categoria')
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

}