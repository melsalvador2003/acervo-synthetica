"""
=============================================================================
PORTAL SYNTHETICA — BACKEND API (FASTAPI)
Disciplina: Framework Application & Arquiteturas de Software
Alinhamento Interdisciplinar:
  - Database Application (MER Relacional / Modelagem em Memória)
  - Digital Product & Business (Assinaturas, Checkout e Monetização)
  - Game Dev & Gamification (Baú de Memórias dos Anos 80 e Chave de 1994)
=============================================================================
Instruções de Execução:
  1. Instalar dependências:
     pip install fastapi uvicorn pydantic
  2. Executar o servidor:
     uvicorn main:app --reload --port 8000
  3. Acessar a documentação interativa Swagger (OpenAPI):
     http://localhost:8000/docs
=============================================================================
"""

from typing import List, Optional
from enum import Enum
from datetime import datetime
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# =============================================================================
# 1. INICIALIZAÇÃO DA APLICAÇÃO FASTAPI
# =============================================================================
app = FastAPI(
    title="Synthetica Archive API — Backend FastAPI",
    description=(
        "API RESTful para gestão de acervo cultural digital, assinaturas "
        "e gamificação histórica do Portal Synthetica. Desenvolvida em conformidade "
        "com o MER da disciplina Database Application."
    ),
    version="2.0.0",
    contact={
        "name": "Equipe Portal Synthetica",
        "email": "contato@synthetica.art.br",
    },
)

# Configuração de CORS para permitir integração com o Frontend em React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar os domínios do Frontend React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================================================
# 2. ENUMS & MODELOS PYDANTIC (BASEADOS NO MER DE DATABASE APPLICATION)
# =============================================================================

class CategoriaEnum(str, Enum):
    CINEMA = "cinema"
    MUSICA = "musica"
    DANCA = "danca"
    ARTES_VISUAIS = "artes-plasticas"
    ELETRONICOS = "eletronicos"

class DecadaEnum(str, Enum):
    DEC_1980 = "1980s"
    DEC_1990 = "1990s"
    DEC_2000 = "2000s"
    DEC_2010 = "2010s"
    DEC_2020 = "2020s"

class PlanoAssinaturaEnum(str, Enum):
    FREEMIUM = "freemium"
    INDIE = "indie"
    ARCHIVAL_VIP = "archival_vip"

class MetodoPagamentoEnum(str, Enum):
    PIX = "pix"
    CARTAO_CREDITO = "cartao_credito"


# --- Esquemas da Entidade Obra (MER: Tabela OBRA) ---
class ObraBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=150, description="Título da obra ou manifesto")
    originalTitle: Optional[str] = Field(None, max_length=150, description="Título original se estrangeiro")
    creator: str = Field(..., min_length=2, max_length=100, description="Artista, diretor ou pioneiro")
    year: int = Field(..., ge=1970, le=2030, description="Ano de lançamento ou criação")
    decade: DecadaEnum = Field(..., description="Década histórica de referência")
    category: CategoriaEnum = Field(..., description="Categoria cultural da obra")
    coverUrl: str = Field(..., description="URL canônica da capa ou pôster oficial")
    curatorialNotes: str = Field(..., min_length=10, description="Análise crítica e relevância cibernética")
    aestheticTags: List[str] = Field(default_factory=list, description="Tags de estilo e estética")
    mediaType: str = Field(default="image", description="Tipo de mídia (image, 3d, audio)")
    quote: Optional[str] = Field(None, description="Citação emblemática da obra")
    audioSampleUrl: Optional[str] = Field(None, description="Amostra de áudio ou paisagem sonora")

class ObraCreate(ObraBase):
    pass

class ObraUpdate(BaseModel):
    title: Optional[str] = None
    originalTitle: Optional[str] = None
    creator: Optional[str] = None
    year: Optional[int] = None
    decade: Optional[DecadaEnum] = None
    category: Optional[CategoriaEnum] = None
    coverUrl: Optional[str] = None
    curatorialNotes: Optional[str] = None
    aestheticTags: Optional[List[str]] = None
    quote: Optional[str] = None

class ObraResponse(ObraBase):
    id: str
    likesCount: int = 0
    viewsCount: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "id": "syn-mus-01",
                "title": "Computer World (Computerwelt)",
                "creator": "Kraftwerk",
                "year": 1981,
                "decade": "1980s",
                "category": "musica",
                "coverUrl": "https://upload.wikimedia.org/wikipedia/en/9/9c/Kraftwerk_-_Computer_World.jpg",
                "curatorialNotes": "Álbum seminal que profetizou o domínio dos computadores pessoais na vida cotidiana.",
                "aestheticTags": ["Synthpop", "Eletrônica Analógica", "Profecia Cibernética"],
                "mediaType": "audio",
                "likesCount": 42
            }
        }


# --- Esquemas de Assinatura & Checkout (Digital Product & Business) ---
class CheckoutRequest(BaseModel):
    plan: PlanoAssinaturaEnum
    billingCycle: str = Field("monthly", description="'monthly' ou 'annual'")
    paymentMethod: MetodoPagamentoEnum
    userEmail: str = Field(..., description="E-mail do assinante para chave digital")
    couponCode: Optional[str] = None

class CheckoutResponse(BaseModel):
    transactionId: str
    status: str
    plan: PlanoAssinaturaEnum
    amountPaid: float
    confirmedAt: datetime
    message: str


# --- Esquemas de Gamificação (Game Dev & Gamification) ---
class FragmentoMemoria(BaseModel):
    id: str
    name: str
    year: int
    format: str
    description: str
    unlocked: bool = False
    relatedWorkId: str


# =============================================================================
# 3. BANCO DE DADOS EM MEMÓRIA (SIMULADO BASEADO NO MER)
# =============================================================================
# Conforme diretriz do enunciado:
# "Esse banco pode ser simulado em memória (lista de dicionários ou objetos)"

db_obras: List[dict] = [
    {
        "id": "syn-cin-01",
        "title": "Blade Runner: O Caçador de Androides",
        "originalTitle": "Blade Runner",
        "creator": "Ridley Scott",
        "year": 1982,
        "decade": "1980s",
        "category": "cinema",
        "coverUrl": "https://upload.wikimedia.org/wikipedia/pt/b/bb/Blade_runner_poster.jpg",
        "curatorialNotes": "Marco seminal do cyberpunk e neo-noir que definiu a estética visual de futuros distópicos hipertecnológicos.",
        "aestheticTags": ["Cyberpunk", "Neo-noir", "Androides", "Distopia"],
        "mediaType": "image",
        "quote": "Todos esses momentos se perderão no tempo, como lágrimas na chuva.",
        "likesCount": 84,
        "viewsCount": 612,
        "createdAt": datetime(2026, 1, 15, 10, 0),
    },
    {
        "id": "syn-cin-02",
        "title": "Akira",
        "originalTitle": "AKIRA",
        "creator": "Katsuhiro Otomo",
        "year": 1988,
        "decade": "1980s",
        "category": "cinema",
        "coverUrl": "https://upload.wikimedia.org/wikipedia/pt/6/6f/Akiraposter.jpg",
        "curatorialNotes": "Obra-prima da animação tradicional com mais de 160 mil celuloides desenhados à mão prevendo a megalópole de Neo-Tóquio.",
        "aestheticTags": ["Anime", "Cyberpunk", "Megalópole", "Bio-mutação"],
        "mediaType": "image",
        "quote": "O futuro não é uma linha reta. Existem muitos caminhos.",
        "likesCount": 97,
        "viewsCount": 780,
        "createdAt": datetime(2026, 1, 15, 10, 5),
    },
    {
        "id": "syn-cin-03",
        "title": "The Matrix",
        "originalTitle": "The Matrix",
        "creator": "Lana & Lilly Wachowski",
        "year": 1999,
        "decade": "1990s",
        "category": "cinema",
        "coverUrl": "https://upload.wikimedia.org/wikipedia/pt/c/c1/The_Matrix_Poster.jpg",
        "curatorialNotes": "Revolução dos efeitos visuais com o efeito bullet-time e debate ontológico sobre realidade simulada sob inteligência artificial.",
        "aestheticTags": ["Realidade Simulada", "Bullet-Time", "Inteligência Artificial"],
        "mediaType": "image",
        "quote": "Infelizmente, ninguém pode dizer o que é a Matrix. Você precisa ver por si mesmo.",
        "likesCount": 115,
        "viewsCount": 940,
        "createdAt": datetime(2026, 1, 15, 10, 10),
    },
    {
        "id": "syn-mus-01",
        "title": "Computer World (Computerwelt)",
        "originalTitle": "Computerwelt",
        "creator": "Kraftwerk",
        "year": 1981,
        "decade": "1980s",
        "category": "musica",
        "coverUrl": "https://upload.wikimedia.org/wikipedia/en/9/9c/Kraftwerk_-_Computer_World.jpg",
        "curatorialNotes": "Álbum seminal que antecipou a vigilância digital, bancos de dados globais e computação ubíqua com sintetizadores puros.",
        "aestheticTags": ["Synthpop", "Eletrônica Analógica", "Profecia Digital"],
        "mediaType": "audio",
        "quote": "Interpol e Deutsche Bank, FBI e Scotland Yard...",
        "likesCount": 68,
        "viewsCount": 540,
        "createdAt": datetime(2026, 1, 15, 10, 15),
    },
    {
        "id": "syn-mus-02",
        "title": "Da Lama ao Caos",
        "originalTitle": "Da Lama ao Caos",
        "creator": "Chico Science & Nação Zumbi",
        "year": 1994,
        "decade": "1990s",
        "category": "musica",
        "coverUrl": "https://upload.wikimedia.org/wikipedia/pt/4/4b/Da_Lama_ao_Caos.jpg",
        "curatorialNotes": "O manifesto do Manguebeat fincando a antena parabólica na lama do Recife, hibridizando maracatu e computação gráfica.",
        "aestheticTags": ["Manguebeat", "Afrofuturismo", "Antena Parabólica", "Maracatu Atômico"],
        "mediaType": "audio",
        "quote": "Modernizar o passado é uma evolução musical.",
        "likesCount": 142,
        "viewsCount": 1020,
        "createdAt": datetime(2026, 1, 15, 10, 20),
    },
    {
        "id": "syn-ele-01",
        "title": "Apple Macintosh 128K",
        "originalTitle": "Macintosh 128K",
        "creator": "Apple Computer / Steve Jobs & Equipe",
        "year": 1984,
        "decade": "1980s",
        "category": "eletronicos",
        "coverUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Macintosh_128k_transparency.png",
        "curatorialNotes": "O computador pessoal que popularizou a interface gráfica (GUI), janelas e o mouse comercial para o público em massa.",
        "aestheticTags": ["Hardware Clássico", "GUI", "Desktop Publishing", "Mouse"],
        "mediaType": "image",
        "quote": "Insanely Great.",
        "likesCount": 133,
        "viewsCount": 980,
        "createdAt": datetime(2026, 1, 15, 10, 25),
    },
    {
        "id": "syn-ele-02",
        "title": "Game Boy Original (DMG-01)",
        "originalTitle": "Nintendo Game Boy",
        "creator": "Gunpei Yokoi & Nintendo R&D1",
        "year": 1989,
        "decade": "1980s",
        "category": "eletronicos",
        "coverUrl": "https://upload.wikimedia.org/wikipedia/commons/f/f4/Game-Boy-FL.png",
        "curatorialNotes": "Console portátil com tela LCD matriz de pontos esverdeada que democratizou os videogames móveis com cartuchos e Tetris.",
        "aestheticTags": ["8-Bit Portátil", "Chiptune", "LCD Matriz", "Cartuchos"],
        "mediaType": "image",
        "quote": "Pensamento lateral com tecnologia desidratada.",
        "likesCount": 128,
        "viewsCount": 890,
        "createdAt": datetime(2026, 1, 15, 10, 30),
    }
]

# Tabela em memória de Gamificação (Game Dev & Gamification)
db_fragmentos: List[dict] = [
    {
        "id": "frag-01",
        "name": "Fita Cassete de Cromo (1981)",
        "year": 1981,
        "format": "Fita Magnética Tipo II",
        "description": "Fragmento sonoro do Kraftwerk contendo as frequências originais sintetizadas no estúdio Kling Klang.",
        "unlocked": False,
        "relatedWorkId": "syn-mus-01"
    },
    {
        "id": "frag-02",
        "name": "Disquete 3.5\" do Mac System 1.0 (1984)",
        "year": 1984,
        "format": "Disquete Magnético 400KB",
        "description": "Contém os ícones originais desenhados por Susan Kare para o revolucionário Macintosh 128K.",
        "unlocked": False,
        "relatedWorkId": "syn-ele-01"
    },
    {
        "id": "frag-03",
        "name": "Cartucho Cinza com Tetris (1989)",
        "year": 1989,
        "format": "ROM Cartridge DMG-01",
        "description": "O bloco geométrico de código que viajou com cosmonautas na estação espacial russa Mir.",
        "unlocked": False,
        "relatedWorkId": "syn-ele-02"
    }
]

db_assinaturas: List[dict] = []

# =============================================================================
# 4. ENDPOINTS RESTful (GET, POST, PUT/PATCH, DELETE)
# =============================================================================

@app.get("/", tags=["Geral"])
def raiz_da_api():
    """Boas-vindas e status da API do Portal Synthetica."""
    return {
        "status": "online",
        "sistema": "Synthetica Archive Engine — FastAPI",
        "documentacao_swagger": "/docs",
        "documentacao_redoc": "/redoc",
        "endpoints_principais": {
            "listar_obras": "GET /api/v1/obras",
            "criar_obra": "POST /api/v1/obras",
            "detalhes_obra": "GET /api/v1/obras/{id}",
            "atualizar_obra": "PUT /api/v1/obras/{id}",
            "deletar_obra": "DELETE /api/v1/obras/{id}",
            "gamificacao": "GET /api/v1/gamificacao/fragmentos",
            "checkout_assinatura": "POST /api/v1/assinaturas/checkout"
        }
    }


# --- CRUD COMPLETO DE OBRAS ---

@app.get("/api/v1/obras", response_model=List[ObraResponse], tags=["Acervo (CRUD)"])
def listar_obras(
    categoria: Optional[CategoriaEnum] = Query(None, description="Filtrar por disciplina cultural"),
    decada: Optional[DecadaEnum] = Query(None, description="Filtrar por era tecnológica"),
    busca: Optional[str] = Query(None, description="Busca textual em título, criador ou notas")
):
    """
    Operação READ (GET):
    Lista obras com filtros multidimensionais por categoria cultural e década histórica.
    """
    resultado = db_obras.copy()

    if categoria:
        resultado = [o for o in resultado if o["category"] == categoria.value]

    if decada:
        resultado = [o for o in resultado if o["decade"] == decada.value]

    if busca:
        termo = busca.lower()
        resultado = [
            o for o in resultado
            if termo in o["title"].lower() or termo in o["creator"].lower() or termo in o["curatorialNotes"].lower()
        ]

    return resultado


@app.get("/api/v1/obras/{obra_id}", response_model=ObraResponse, tags=["Acervo (CRUD)"])
def obter_obra_por_id(obra_id: str):
    """
    Operação READ (GET por ID):
    Retorna a ficha técnica detalhada de uma obra específica.
    """
    for obra in db_obras:
        if obra["id"] == obra_id:
            obra["viewsCount"] += 1
            return obra
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Obra com ID '{obra_id}' não encontrada no acervo."
    )


@app.post("/api/v1/obras", response_model=ObraResponse, status_code=status.HTTP_201_CREATED, tags=["Acervo (CRUD)"])
def cadastrar_obra(dados_obra: ObraCreate):
    """
    Operação CREATE (POST):
    Cadastra uma nova obra com validação rigorosa de esquema Pydantic e persistência no banco em memória.
    """
    novo_id = f"syn-user-{len(db_obras) + 1:02d}"

    nova_obra = dados_obra.model_dump()
    nova_obra["id"] = novo_id
    nova_obra["likesCount"] = 0
    nova_obra["viewsCount"] = 1
    nova_obra["createdAt"] = datetime.utcnow()

    db_obras.append(nova_obra)
    return nova_obra


@app.put("/api/v1/obras/{obra_id}", response_model=ObraResponse, tags=["Acervo (CRUD)"])
def atualizar_obra(obra_id: str, dados_atualizacao: ObraUpdate):
    """
    Operação UPDATE (PUT):
    Atualiza os campos de uma obra existente com validação dos novos valores.
    """
    for obra in db_obras:
        if obra["id"] == obra_id:
            dados_dict = dados_atualizacao.model_dump(exclude_unset=True)
            for chave, valor in dados_dict.items():
                if valor is not None:
                    obra[chave] = valor
            return obra

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Obra com ID '{obra_id}' não encontrada para atualização."
    )


@app.patch("/api/v1/obras/{obra_id}/curtir", tags=["Acervo (CRUD)"])
def alternar_curtida(obra_id: str):
    """
    Operação PATCH:
    Incrementa em tempo de execução o contador de curtidas da obra.
    """
    for obra in db_obras:
        if obra["id"] == obra_id:
            obra["likesCount"] += 1
            return {"obra_id": obra_id, "likesCount": obra["likesCount"], "message": "Curtida registrada com sucesso!"}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Obra com ID '{obra_id}' não encontrada."
    )


@app.delete("/api/v1/obras/{obra_id}", status_code=status.HTTP_200_OK, tags=["Acervo (CRUD)"])
def excluir_obra(obra_id: str):
    """
    Operação DELETE:
    Remove a obra especificada da coleção em memória.
    """
    global db_obras
    obra_existente = next((o for o in db_obras if o["id"] == obra_id), None)

    if not obra_existente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Obra com ID '{obra_id}' não encontrada para exclusão."
        )

    db_obras = [o for o in db_obras if o["id"] != obra_id]
    return {
        "status": "sucesso",
        "message": f"Obra '{obra_existente['title']}' removida com sucesso do acervo.",
        "id_removido": obra_id
    }


# --- ROTAS DE MONETIZAÇÃO & DIGITAL PRODUCT & BUSINESS ---

@app.post("/api/v1/assinaturas/checkout", response_model=CheckoutResponse, tags=["Digital Product & Business"])
def realizar_checkout(requisicao: CheckoutRequest):
    """
    Processa a adesão a um plano de assinatura cultural, aplicando descontos e registrando transação.
    """
    precos_base = {
        PlanoAssinaturaEnum.FREEMIUM: 0.0,
        PlanoAssinaturaEnum.INDIE: 24.90,
        PlanoAssinaturaEnum.ARCHIVAL_VIP: 59.90
    }

    valor = precos_base[requisicao.plan]
    if requisicao.billingCycle == "annual":
        valor = valor * 12 * 0.80  # Desconto anual de 20%

    if requisicao.couponCode and requisicao.couponCode.upper() == "MEMORIA10":
        valor = valor * 0.90  # 10% adicional com cupom cultural

    transacao = {
        "transactionId": f"TXN-SYN-{len(db_assinaturas) + 1:04d}",
        "status": "APROVADO",
        "plan": requisicao.plan,
        "amountPaid": round(valor, 2),
        "confirmedAt": datetime.utcnow(),
        "message": f"Acesso liberado com sucesso ao acervo completo com plano {requisicao.plan.value.upper()}!"
    }

    db_assinaturas.append({
        **transacao,
        "userEmail": requisicao.userEmail,
        "paymentMethod": requisicao.paymentMethod.value
    })

    return transacao


# --- ROTAS DE GAMIFICAÇÃO & GAME DEV & GAMIFICATION ---

@app.get("/api/v1/gamificacao/fragmentos", response_model=List[FragmentoMemoria], tags=["Game Dev & Gamification"])
def listar_fragmentos():
    """
    Retorna o status dos 6 fragmentos do Baú de Memórias dos Anos 80 e o progresso da Chave de 1994.
    """
    return db_fragmentos


@app.post("/api/v1/gamificacao/resgatar/{fragment_id}", tags=["Game Dev & Gamification"])
def resgatar_fragmento(fragment_id: str):
    """
    Desbloqueia um fragmento histórico resgatado durante a exploração do acervo.
    """
    for frag in db_fragmentos:
        if frag["id"] == fragment_id:
            frag["unlocked"] = True
            desbloqueados = sum(1 for f in db_fragmentos if f["unlocked"])
            chave_forjada = desbloqueados == len(db_fragmentos)
            return {
                "fragmento_desbloqueado": frag["name"],
                "progresso": f"{desbloqueados}/{len(db_fragmentos)}",
                "chave_de_1994_desbloqueada": chave_forjada,
                "message": "Fragmento adicionado ao Baú de Memórias!"
            }

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Fragmento '{fragment_id}' inexistente."
    )


# =============================================================================
# EXECUÇÃO DIRETA (opcional via python main.py)
# =============================================================================
if __name__ == "__main__":
    import uvicorn
    print("Iniciando servidor FastAPI na porta 8000...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
