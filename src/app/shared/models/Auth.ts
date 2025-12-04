export interface UsuarioRegistro {
    
    nome: string;
    email: string;
    senha: string;

}

export interface UsuarioLogin {
    
    email: string;
    senha: string;

}

export interface AuthResponse {
    
    token: string;
    tipo: string;
    cdUsuario: number;
    nome: string;
    email: string;

}

export interface Usuario {
    
    cdUsuario: number;
    nome: string;
    email: string;

}