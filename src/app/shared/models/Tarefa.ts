export interface Tarefa {
    
    cdTarefa?: number;
    nmTarefa: string;
    stTarefa?: 'PENDENTE' | 'CONCLUÍDA';
    concluido?: string;
    adiado?: string;
    dcTarefa?: string;
    dlTarefa: string;
    categoria?: Categoria;

}

export interface TarefaRequest {
    
    nmTarefa: string;
    dlTarefa: string;
    cdCategoria?: number;

}

export interface Categoria {
    
    cdCategoria?: number;
    nmCategoria: string;

}
