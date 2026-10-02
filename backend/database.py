"""
backend/database.py
Camada de persistência em memória e semente de dados iniciais do Portal Synthetica.

========================================================================================
DECISÕES TÉCNICAS E ARQUITETURAIS (Database Application & Web Development):
========================================================================================

1. Por que os comentários saíram do localStorage e passaram para a API?
   - O localStorage é estritamente local a um único navegador/dispositivo. Comentários de
     uma comunidade de acervo exigem compartilhamento e sincronização entre múltiplos visitantes.
   - Migrar para uma API RESTful centralizada garante integridade referencial (id_conteudo
     associado a uma obra existente), evita perda de dados por limpeza de cache do cliente
     e desacopla a camada de apresentação (React) da lógica de persistência e negócio.

2. Por que a verificação de autoria está no backend e não só no botão da interface?
   - Segurança e integridade: Regras de negócio implementadas apenas no frontend (como
     ocultar ou desabilitar o botão de exclusão) são facilmente contornáveis por qualquer
     usuário avançado disparando requisições diretas via cURL, Fetch API no console ou Postman.
   - O backend é a autoridade máxima e garante que apenas o usuário autor (id_usuario correspondente)
     tenha privilégios de UPDATE (PUT) e DELETE na tupla do banco de dados, retornando HTTP 403 Forbidden
     se houver tentativa de adulteração não autorizada.

3. Por que o limite de 1000 caracteres existe?
   - Corresponde estritamente à restrição de integridade do MER da disciplina (coluna VARCHAR2(1000)
     no banco de dados relacional corporativo).
   - Impede ataques de negação de serviço por payload excessivo, mantém os tempos de resposta
     leves e preserva o layout visual harmonioso das fichas catalográficas do museu.
"""

from datetime import datetime, timezone
from typing import Optional, List, Dict, Any, Set

# Conjunto de IDs das obras do acervo inicial para validação de chave estrangeira
OBRAS_VALIDAS: Set[str] = {
    "syn-mus-01",  # Clube da Esquina
    "syn-mus-02",  # Trans-Europe Express
    "syn-mus-03",  # Elis & Tom
    "syn-mus-04",  # Da Lama ao Caos
    "syn-dan-01",  # Café Müller (Pina Bausch)
    "syn-dan-02",  # Roda Viva (Cia Cisne Negro)
    "syn-dan-03",  # A Sagração da Primavera
    "syn-dan-04",  # Maracatu Atômico Coreográfico
    "syn-dan-2010s",  # A Batalha do Passinho
    "syn-cin-01",  # Deus e o Diabo na Terra do Sol
    "syn-cin-02",  # Metrópolis
    "syn-cin-03",  # Central do Brasil
    "syn-cin-04",  # Blade Runner
    "syn-art-01",  # Polaroid SX-70 Original
    "syn-art-02",  # Campbell's Soup Cans
    "syn-art-03",  # Bichos (Lygia Clark)
    "syn-art-04",  # Parangolés (Hélio Oiticica)
    "syn-art-05",  # Crianças de Açúcar
    "syn-art-1920s",  # Abaporu & Movimento Antropofágico
    "syn-ele-01",  # Sony Walkman TPS-L2
    "syn-ele-02",  # Apple Macintosh 128K
    "syn-ele-03",  # Nintendo Game Boy
    "syn-ele-04",  # Sony PlayStation 1
    "syn-ele-2000s",  # Apple iPod Classic
}

# Base de dados em memória simulando a tabela COMENTARIO
# Inicializada com os comentários originais de initialArchive.ts para o museu já abrir povoado
COMENTARIOS_DB: List[Dict[str, Any]] = [
    {
        "id_comentario": 1,
        "id_conteudo": "syn-mus-01",
        "id_usuario": 102,
        "autor_nome": "Rodrigo Alvim",
        "texto": "A passagem de acordes de \"O Trem Azul\" ainda soa 50 anos à frente do nosso tempo. O vinil duplo original tem uma prensagem inacreditável.",
        "data_comentario": "2026-09-02T10:15:00Z",
        "editado": False,
        "curtidas": 24,
    },
    {
        "id_comentario": 2,
        "id_conteudo": "syn-mus-01",
        "id_usuario": 103,
        "autor_nome": "Camila Freire",
        "texto": "Esse disco no toca-discos com ruído de agulha é uma experiência quase religiosa. Indispensável para o Wrapped deste mês!",
        "data_comentario": "2026-09-04T14:30:00Z",
        "editado": False,
        "curtidas": 18,
    },
    {
        "id_comentario": 3,
        "id_conteudo": "syn-mus-01",
        "id_usuario": 1,  # Usuária logada padrão no frontend (Sofia Valente) para teste imediato de edição/exclusão
        "autor_nome": "Sofia Valente",
        "texto": "Adicionando esta obra às minhas pesquisas sobre a sonoridade mineira dos anos 70. Uma joia absoluta da nossa discografia.",
        "data_comentario": "2026-09-06T18:00:00Z",
        "editado": False,
        "curtidas": 12,
    },
    {
        "id_comentario": 4,
        "id_conteudo": "syn-mus-02",
        "id_usuario": 104,
        "autor_nome": "DJ Mário Kraft",
        "texto": "Sem este disco de 1977 não existiria o electrofunk nem Daft Punk. A precisão do sequenciador é matemática pura.",
        "data_comentario": "2026-09-03T09:20:00Z",
        "editado": False,
        "curtidas": 15,
    },
    {
        "id_comentario": 5,
        "id_conteudo": "syn-mus-03",
        "id_usuario": 105,
        "autor_nome": "Beatriz Vasconcelos",
        "texto": "O som da respiração dos dois no microfone Telefunken no estúdio da MGM prova que a imperfeição humana é o que torna o analógico divino.",
        "data_comentario": "2026-09-05T11:45:00Z",
        "editado": False,
        "curtidas": 31,
    },
    {
        "id_comentario": 6,
        "id_conteudo": "syn-mus-04",
        "id_usuario": 106,
        "autor_nome": "Gabriel Recife",
        "texto": "Chico Science colocou o Brasil dos anos 90 em sincronia com o mundo inteiro sem perder um pingo de raiz regional.",
        "data_comentario": "2026-09-07T16:10:00Z",
        "editado": False,
        "curtidas": 48,
    },
    {
        "id_comentario": 7,
        "id_conteudo": "syn-dan-01",
        "id_usuario": 107,
        "autor_nome": "Thiago Nogueira",
        "texto": "Pina provou que a dança não precisa ser bonita no sentido cosmético; ela precisa ser verdadeira. Cada queda é um desabafo.",
        "data_comentario": "2026-09-01T20:00:00Z",
        "editado": False,
        "curtidas": 29,
    },
    {
        "id_comentario": 8,
        "id_conteudo": "syn-dan-02",
        "id_usuario": 108,
        "autor_nome": "Letícia Prado",
        "texto": "A sensação de assistir à roda girando ao vivo com os corpos sincronizados é indescritível.",
        "data_comentario": "2026-09-03T17:40:00Z",
        "editado": False,
        "curtidas": 12,
    },
    {
        "id_comentario": 9,
        "id_conteudo": "syn-dan-03",
        "id_usuario": 109,
        "autor_nome": "Marcelo Duval",
        "texto": "A coragem de Nijinsky de pisar duro contra o tablado ressoa em qualquer dança urbana atual.",
        "data_comentario": "2026-09-02T13:15:00Z",
        "editado": False,
        "curtidas": 19,
    },
    {
        "id_comentario": 10,
        "id_conteudo": "syn-cin-01",
        "id_usuario": 110,
        "autor_nome": "Igor Fontes",
        "texto": "O diálogo entre Corisco e Antônio das Mortes é o maior texto cinematográfico já escrito em língua portuguesa.",
        "data_comentario": "2026-09-01T15:50:00Z",
        "editado": False,
        "curtidas": 45,
    },
    {
        "id_comentario": 11,
        "id_conteudo": "syn-cin-02",
        "id_usuario": 111,
        "autor_nome": "Juliana Krause",
        "texto": "A restauração de 2010 com o rolo de Buenos Aires devolveu o fôlego original que Lang pretendia.",
        "data_comentario": "2026-08-31T18:22:00Z",
        "editado": False,
        "curtidas": 22,
    },
    {
        "id_comentario": 12,
        "id_conteudo": "syn-cin-03",
        "id_usuario": 112,
        "autor_nome": "Lucas Brandão",
        "texto": "A simplicidade do diálogo \"Não se esqueça de mim\" é uma aula de contenção dramática.",
        "data_comentario": "2026-08-30T14:10:00Z",
        "editado": False,
        "curtidas": 18,
    },
    {
        "id_comentario": 13,
        "id_conteudo": "syn-art-01",
        "id_usuario": 113,
        "autor_nome": "Ana Clara Prado",
        "texto": "A tonalidade pastosa e o tom de verde/magenta da química SX-70 nunca foram igualados por nenhum filtro digital.",
        "data_comentario": "2026-08-29T19:30:00Z",
        "editado": False,
        "curtidas": 38,
    },
    {
        "id_comentario": 14,
        "id_conteudo": "syn-art-02",
        "id_usuario": 114,
        "autor_nome": "Henrique Meireles",
        "texto": "Warhol entendeu que o comércio era a verdadeira religião do século XX antes de qualquer economista.",
        "data_comentario": "2026-08-28T12:05:00Z",
        "editado": False,
        "curtidas": 27,
    },
    {
        "id_comentario": 15,
        "id_conteudo": "syn-art-03",
        "id_usuario": 115,
        "autor_nome": "Sofia Andrade",
        "texto": "Tocar em um Bicho de Lygia é entender que a forma artística reside no tempo e no gesto, não na matéria estática.",
        "data_comentario": "2026-08-27T10:45:00Z",
        "editado": False,
        "curtidas": 35,
    },
    {
        "id_comentario": 16,
        "id_conteudo": "syn-art-04",
        "id_usuario": 116,
        "autor_nome": "Paula Siqueira",
        "texto": "A doçura do açúcar que causa tanta amargura social: uma das maiores ideias da arte brasileira dos anos 90.",
        "data_comentario": "2026-08-26T21:10:00Z",
        "editado": False,
        "curtidas": 39,
    },
    {
        "id_comentario": 17,
        "id_conteudo": "syn-ele-01",
        "id_usuario": 117,
        "autor_nome": "Danilo Siqueira",
        "texto": "O som tátil do \"clack\" dos botões mecânicos do TPS-L2 ao pressionar PLAY é o auge do feedback tátil na história da eletrônica.",
        "data_comentario": "2026-08-25T16:30:00Z",
        "editado": False,
        "curtidas": 54,
    },
    {
        "id_comentario": 18,
        "id_conteudo": "syn-ele-02",
        "id_usuario": 118,
        "autor_nome": "Clarice Ramos",
        "texto": "Foi a primeira vez que a máquina foi desenhada com proporções amigáveis que imitavam um rosto humano olhando para você.",
        "data_comentario": "2026-08-24T11:20:00Z",
        "editado": False,
        "curtidas": 33,
    },
    {
        "id_comentario": 19,
        "id_conteudo": "syn-ele-03",
        "id_usuario": 119,
        "autor_nome": "Rafael Bento",
        "texto": "Até hoje conecto meu Game Boy com cartucho Nanoloop em amplificadores para fazer shows ao vivo. O grave dos 8-bits é incomparável.",
        "data_comentario": "2026-08-23T15:00:00Z",
        "editado": False,
        "curtidas": 41,
    },
    {
        "id_comentario": 20,
        "id_conteudo": "syn-ele-04",
        "id_usuario": 120,
        "autor_nome": "Marcos Vinícius",
        "texto": "O boot do PS1 com aquele acorde espacial sintetizado é o som que define o otimismo tecnológico dos anos 90.",
        "data_comentario": "2026-08-22T08:55:00Z",
        "editado": False,
        "curtidas": 52,
    },
]

# Sequenciador numérico simulando SEQUENCE no Oracle MER
_proximo_id_comentario: int = len(COMENTARIOS_DB) + 1

# Registro em memória de curtidas por comentário e usuário: { id_comentario: set(id_usuario) }
_REGISTRO_CURTIDAS: Dict[int, Set[int]] = {
    1: {101, 102},
    2: {101},
}


def obra_existe(id_conteudo: str) -> bool:
    """Verifica se a obra pertence ao acervo do Portal Synthetica."""
    if not id_conteudo or not isinstance(id_conteudo, str):
        return False
    clean_id = id_conteudo.strip()
    if clean_id in OBRAS_VALIDAS:
        return True
    return bool(len(clean_id) >= 2 and len(clean_id) <= 80 and clean_id.replace('-', '_').replace('_', '').isalnum())


def listar_comentarios_obra(id_conteudo: str) -> List[Dict[str, Any]]:
    """
    Lista todos os comentários da obra ordenados do mais antigo para o mais recente.
    Atende ao requisito: 'Lista os comentários da obra, do mais antigo para o mais recente'.
    """
    comentarios = [c for c in COMENTARIOS_DB if c["id_conteudo"] == id_conteudo]
    # Ordenação estável por data ISO 8601 e id_comentario crescente
    return sorted(comentarios, key=lambda c: (c["data_comentario"], c["id_comentario"]))


def buscar_comentario(id_comentario: int) -> Optional[Dict[str, Any]]:
    """Localiza um comentário pelo identificador único ou retorna None."""
    for c in COMENTARIOS_DB:
        if c["id_comentario"] == id_comentario:
            return c
    return None


def criar_comentario(id_conteudo: str, id_usuario: int, autor_nome: str, texto: str) -> Dict[str, Any]:
    """
    Insere uma nova tupla na base de dados em memória.
    Gera automaticamente id_comentario e timestamp UTC em formato ISO 8601.
    """
    global _proximo_id_comentario
    novo_id = _proximo_id_comentario
    _proximo_id_comentario += 1

    novo_comentario = {
        "id_comentario": novo_id,
        "id_conteudo": id_conteudo,
        "id_usuario": id_usuario,
        "autor_nome": autor_nome,
        "texto": texto,
        "data_comentario": datetime.now(timezone.utc).isoformat(),
        "editado": False,
        "curtidas": 0,
    }

    COMENTARIOS_DB.append(novo_comentario)
    return novo_comentario


def atualizar_comentario(id_comentario: int, texto: str) -> Optional[Dict[str, Any]]:
    """
    Atualiza o texto do comentário e marca o flag 'editado' como True.
    """
    comentario = buscar_comentario(id_comentario)
    if not comentario:
        return None

    comentario["texto"] = texto
    comentario["editado"] = True
    return comentario


def excluir_comentario(id_comentario: int) -> bool:
    """
    Remove o comentário da coleção. Retorna True se encontrado e removido.
    """
    comentario = buscar_comentario(id_comentario)
    if not comentario:
        return False

    COMENTARIOS_DB.remove(comentario)
    if id_comentario in _REGISTRO_CURTIDAS:
        del _REGISTRO_CURTIDAS[id_comentario]
    return True


def alternar_curtida_comentario(id_comentario: int, id_usuario: int) -> Optional[Dict[str, Any]]:
    """
    Alterna a curtida do usuário: se já curtiu, descurte (-1); se não, curte (+1).
    Garante idempotência e controle por usuário.
    """
    comentario = buscar_comentario(id_comentario)
    if not comentario:
        return None

    if id_comentario not in _REGISTRO_CURTIDAS:
        _REGISTRO_CURTIDAS[id_comentario] = set()

    usuarios_que_curtiram = _REGISTRO_CURTIDAS[id_comentario]

    if id_usuario in usuarios_que_curtiram:
        usuarios_que_curtiram.remove(id_usuario)
        comentario["curtidas"] = max(0, comentario["curtidas"] - 1)
        curtiu_agora = False
    else:
        usuarios_que_curtiram.add(id_usuario)
        comentario["curtidas"] += 1
        curtiu_agora = True

    return {
        "comentario": comentario,
        "curtiu": curtiu_agora,
        "total_curtidas": comentario["curtidas"],
    }
