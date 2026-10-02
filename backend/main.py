"""
backend/main.py
Aplicação FastAPI para o Portal Synthetica - Módulo de Gestão de Comentários do Acervo.

========================================================================================
ROTAS IMPLEMENTADAS:
========================================================================================
- GET    /api/conteudos/{id_conteudo}/comentarios     -> Lista comentários ordenados (mais antigo -> mais recente)
- POST   /api/conteudos/{id_conteudo}/comentarios     -> Cria comentário para a obra (HTTP 201)
- PUT    /api/comentarios/{id_comentario}             -> Atualiza texto com flag editado=True (HTTP 200, validação 403)
- DELETE /api/comentarios/{id_comentario}             -> Exclui tupla da base (HTTP 204, validação 403)
- POST   /api/comentarios/{id_comentario}/curtida     -> Alterna reação de curtida do usuário

Configurado com CORS liberado para o frontend (http://localhost:3000).
"""

from typing import List, Optional
from fastapi import FastAPI, HTTPException, status, Query, Body, Response
from fastapi.middleware.cors import CORSMiddleware

from .models import (
    ComentarioCreate,
    ComentarioUpdate,
    ComentarioDeletePayload,
    CurtidaTogglePayload,
    ComentarioResponse,
)
from .database import (
    obra_existe,
    listar_comentarios_obra,
    buscar_comentario,
    criar_comentario,
    atualizar_comentario,
    excluir_comentario,
    alternar_curtida_comentario,
)

app = FastAPI(
    title="Portal Synthetica - API de Comentários",
    version="1.0.0",
    description="API RESTful para gestão e moderação de comentários no acervo digital de artes do Portal Synthetica.",
)

# ======================================================================================
# CONFIGURAÇÃO DE CORS
# ======================================================================================
# Permite comunicação bidirecional com o frontend React/Vite rodando na porta 3000
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*",  # Abrangência para ambientes de preview e containers
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", tags=["Monitoramento"])
def health_check():
    """Endpoint de verificação de integridade operacional do backend FastAPI."""
    return {
        "status": "online",
        "service": "Portal Synthetica - FastAPI Comments Microservice",
        "port": 8000,
        "database": "in-memory (MER COMENTARIO)",
    }


# ======================================================================================
# 1. LISTAR COMENTÁRIOS DE UMA OBRA
# ======================================================================================
@app.get(
    "/api/conteudos/{id_conteudo}/comentarios",
    response_model=List[ComentarioResponse],
    status_code=status.HTTP_200_OK,
    tags=["Comentários"],
    summary="Lista comentários de uma obra específica",
)
def get_comentarios_obra(id_conteudo: str):
    """
    Lista todos os comentários vinculados a uma obra do acervo.
    Os registros são retornados ordenados cronologicamente do mais antigo para o mais recente.
    """
    if not obra_existe(id_conteudo):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Obra com id '{id_conteudo}' não encontrada no acervo do portal.",
        )

    return listar_comentarios_obra(id_conteudo)


# ======================================================================================
# 2. CRIAR COMENTÁRIO
# ======================================================================================
@app.post(
    "/api/conteudos/{id_conteudo}/comentarios",
    response_model=ComentarioResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Comentários"],
    summary="Cria um novo comentário para a obra indicada",
)
def post_comentario(id_conteudo: str, payload: ComentarioCreate):
    """
    Cadastra uma nova contribuição no acervo.
    Validações:
    - 404 se a obra (id_conteudo) não existir no acervo.
    - 422 se o texto for vazio ou ultrapassar 1000 caracteres (regra VARCHAR2(1000)).
    """
    if not obra_existe(id_conteudo):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Obra com id '{id_conteudo}' não encontrada no acervo. Não é possível comentar em obra inexistente.",
        )

    novo = criar_comentario(
        id_conteudo=id_conteudo,
        id_usuario=payload.id_usuario,
        autor_nome=payload.autor_nome,
        texto=payload.texto,
    )
    return novo


# ======================================================================================
# 3. ATUALIZAR COMENTÁRIO
# ======================================================================================
@app.put(
    "/api/comentarios/{id_comentario}",
    response_model=ComentarioResponse,
    status_code=status.HTTP_200_OK,
    tags=["Comentários"],
    summary="Atualiza o texto de um comentário existente",
)
def put_comentario(id_comentario: int, payload: ComentarioUpdate):
    """
    Atualiza o texto do comentário e marca o atributo editado=True.
    Validações:
    - 404 se o comentário não existir.
    - 403 se o id_usuario fornecido não coincidir com o autor original do comentário.
    - 422 se o novo texto for vazio ou exceder 1000 caracteres.
    """
    comentario = buscar_comentario(id_comentario)
    if not comentario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Comentário #{id_comentario} não encontrado no sistema.",
        )

    # Verificação estrita de autoria no servidor (Segurança e Integridade)
    if comentario["id_usuario"] != payload.id_usuario:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                f"Permissão negada. Apenas o autor original (usuário #{comentario['id_usuario']}) "
                f"pode editar este comentário. Usuário #{payload.id_usuario} não tem autorização."
            ),
        )

    atualizado = atualizar_comentario(id_comentario=id_comentario, texto=payload.texto)
    return atualizado


# ======================================================================================
# 4. EXCLUIR COMENTÁRIO
# ======================================================================================
@app.delete(
    "/api/comentarios/{id_comentario}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["Comentários"],
    summary="Remove um comentário do acervo",
)
def delete_comentario(
    id_comentario: int,
    id_usuario: Optional[int] = Query(None, description="ID do usuário autor passado via query parameter"),
    payload: Optional[ComentarioDeletePayload] = Body(None, description="ID do usuário autor passado via corpo JSON"),
):
    """
    Exclui permanentemente um comentário do acervo.
    Aceita o id_usuario tanto por query parameter (?id_usuario=1) quanto pelo corpo da requisição.
    Validações:
    - 404 se o comentário não existir.
    - 403 se o id_usuario não for o autor do comentário.
    - 204 se a exclusão for efetuada com sucesso.
    """
    user_id = id_usuario if id_usuario is not None else (payload.id_usuario if payload else None)

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="O identificador do usuário autor (id_usuario) é obrigatório via query ou corpo da requisição para verificar permissão de exclusão.",
        )

    comentario = buscar_comentario(id_comentario)
    if not comentario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Comentário #{id_comentario} não encontrado.",
        )

    # Verificação estrita de autoria no servidor
    if comentario["id_usuario"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                f"Permissão negada. Apenas o autor original (usuário #{comentario['id_usuario']}) "
                f"pode excluir este comentário. O usuário #{user_id} não possui privilégios de exclusão."
            ),
        )

    sucesso = excluir_comentario(id_comentario)
    if not sucesso:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Erro ao excluir o comentário.")

    return Response(status_code=status.HTTP_204_NO_CONTENT)


# ======================================================================================
# 5. ALTERNAR CURTIDA
# ======================================================================================
@app.post(
    "/api/comentarios/{id_comentario}/curtida",
    response_model=ComentarioResponse,
    status_code=status.HTTP_200_OK,
    tags=["Comentários"],
    summary="Alterna a curtida do usuário no comentário",
)
def toggle_curtida(id_comentario: int, payload: CurtidaTogglePayload):
    """
    Alterna a reação de curtida no comentário:
    Se o usuário já curtiu, descurte (-1); caso contrário, adiciona curtida (+1).
    Validações:
    - 404 se o comentário não for encontrado.
    """
    resultado = alternar_curtida_comentario(id_comentario=id_comentario, id_usuario=payload.id_usuario)
    if not resultado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Comentário #{id_comentario} não encontrado para registrar curtida.",
        )

    return resultado["comentario"]
