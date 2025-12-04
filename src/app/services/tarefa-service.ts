import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarefa, TarefaRequest } from '../shared/models/Tarefa';

@Injectable({
  providedIn: 'root'
})

export class TarefaService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8089/api/tarefas';

  listarTodas(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Tarefa> {
    return this.http.get<Tarefa>(`${this.apiUrl}/${id}`);
  }

  criar(tarefa: TarefaRequest): Observable<Tarefa> {
    return this.http.post<Tarefa>(this.apiUrl, tarefa);
  }

  atualizar(id: number, tarefa: TarefaRequest): Observable<Tarefa> {
    return this.http.put<Tarefa>(`${this.apiUrl}/${id}`, tarefa);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  concluir(id: number): Observable<Tarefa> {
    return this.http.put<Tarefa>(`${this.apiUrl}/concluir/${id}`, {});
  }

  adiar(id: number): Observable<Tarefa> {
    return this.http.put<Tarefa>(`${this.apiUrl}/adiar/${id}`, {});
  }

  atribuirCategoria(idTarefa: number, idCategoria: number): Observable<Tarefa> {
    return this.http.put<Tarefa>(`${this.apiUrl}/${idTarefa}/categoria/${idCategoria}`, {});
  }
}