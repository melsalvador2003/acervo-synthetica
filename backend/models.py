"""
backend/models.py
Schemas Pydantic para validação e serialização da API de Comentários do Portal Synthetica.

Decisão Técnica:
A modelagem segue estritamente o MER da tabela COMENTARIO da disciplina de Database Application:
- id_comentario: Identificador numérico único
- id_conteudo: Chave estrangeira lógica para a obra no acervo
- id_usuario: Identificador numérico do autor (usado para controle de autoria no backend)
- autor_nome: Nome de exibição público do curador/visitante
- texto: Conteúdo textual limitado a 1000 caracteres (mapeado para VARCHAR2(1000) no banco de dados)
- data_comentario: Timestamp em formato ISO 8601
- editado: Flag booleana indicando se o comentário já sofreu revisão
- curtidas: Contador numérico de reações da comunidade
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional


class ComentarioBase(BaseModel):
    """Base com validação de texto conforme restrição de integridade VARCHAR2(1000)."""
    texto: str = Field(
        ...,
        min_length=1,
        max_length=1000,
        description="Conteúdo do comentário (máximo 1000 caracteres, correspondente ao VARCHAR2(1000) do Oracle/MER)."
    )

    @field_validator("texto")
    @classmethod
    def validar_texto_nao_vazio(cls, valor: str) -> str:
        stripped = valor.strip()
        if not stripped:
            raise ValueError("O comentário não pode conter apenas espaços em branco.")
        return stripped


class ComentarioCreate(ComentarioBase):
    """Payload para criação de um novo comentário em uma obra."""
    id_usuario: int = Field(..., description="ID numérico do usuário autor do comentário.")
    autor_nome: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Nome do autor para exibição pública na comunidade do acervo."
    )


class ComentarioUpdate(ComentarioBase):
    """
    Payload para atualização de um comentário existente.
    Exige id_usuario para validação de autorização (apenas o autor pode alterar).
    """
    id_usuario: int = Field(..., description="ID numérico do usuário que está solicitando a edição.")


class ComentarioDeletePayload(BaseModel):
    """Payload opcional no corpo para requisições DELETE."""
    id_usuario: int = Field(..., description="ID numérico do usuário autor solicitando a exclusão.")


class CurtidaTogglePayload(BaseModel):
    """Payload para alternar a curtida de um usuário em um comentário."""
    id_usuario: int = Field(..., description="ID numérico do usuário reagindo ao comentário.")


class ComentarioResponse(BaseModel):
    """Schema de resposta representando a entidade COMENTARIO completa."""
    id_comentario: int
    id_conteudo: str
    id_usuario: int
    autor_nome: str
    texto: str
    data_comentario: str
    editado: bool
    curtidas: int

    class Config:
        from_attributes = True
