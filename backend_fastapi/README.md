# Synthetica Archive API — Backend FastAPI (Python)

Backend RESTful desenvolvido com **FastAPI** para o ecossistema do **Portal Synthetica**, atendendo integralmente aos requisitos técnicos interdisciplinares:

- **Database Application**: Modelagem de dados baseada no Modelo Entidade-Relacionamento (MER) com entidades `Obras`, `Categorias`, `Assinaturas`, `Comentários` e `Fragmentos de Gamificação`, implementada em memória através de listas de dicionários e esquemas Pydantic fortemente tipados.
- **Framework Application**: Endpoints RESTful completos (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) para integração fluida com o frontend em React via CORS.
- **Digital Product & Business**: Rotas de checkout de planos de assinatura cultural com desconto anual e cupons.
- **Game Dev & Gamification**: Gerenciamento dos 6 fragmentos históricos analógicos do Baú de Memórias dos Anos 80 e status da mítica Chave de 1994.

---

## 🚀 Como Executar o Backend FastAPI

### 1. Pré-requisitos
Certifique-se de ter o **Python 3.10+** instalado.

### 2. Instalação das Dependências
No terminal, dentro desta pasta:
```bash
pip install -r requirements.txt
```
*(Ou instale diretamente: `pip install fastapi uvicorn pydantic`)*

### 3. Iniciar o Servidor
```bash
uvicorn main:app --reload --port 8000
```
O servidor iniciará em `http://localhost:8000`.

---

## 📖 Documentação Interativa (Swagger & Redoc)
O FastAPI gera documentação interativa automática com testes ao vivo de cada endpoint:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Redoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 📡 Mapeamento de Endpoints (CRUD & Regras de Negócio)

| Método | Endpoint | Descrição |
|---|---|---|
| **GET** | `/api/v1/obras` | Listagem com filtros por categoria cultural e década histórica |
| **GET** | `/api/v1/obras/{id}` | Obter ficha técnica detalhada da obra |
| **POST** | `/api/v1/obras` | **Cadastrar** nova obra no acervo (validação Pydantic) |
| **PUT** | `/api/v1/obras/{id}` | **Atualizar** campos de uma obra existente |
| **PATCH** | `/api/v1/obras/{id}/curtir` | Alternar e incrementar curtidas em tempo real |
| **DELETE** | `/api/v1/obras/{id}` | **Remover** obra do acervo em memória |
| **POST** | `/api/v1/assinaturas/checkout` | Processar checkout de assinaturas culturais |
| **GET** | `/api/v1/gamificacao/fragmentos` | Listar status dos fragmentos do Baú de Memórias |
| **POST** | `/api/v1/gamificacao/resgatar/{id}` | Desbloquear fragmento e forjar a Chave de 1994 |

---

## 🏗️ Alinhamento com o MER de Database Application

- **Tabela OBRA**: Chave primária `id`, atributos obrigatórios e metadados históricos (`title`, `creator`, `year`, `decade`, `category`, `coverUrl`, `curatorialNotes`, `aestheticTags`).
- **Tabela ASSINATURA**: Registros de adesão aos planos (Freemium, Indie, Archival VIP) integrados com Digital Product & Business.
- **Tabela GAMIFICACAO**: Controle de fragmentos colecionáveis e desbloqueio da Chave de 1994, integrado com Game Dev & Gamification.
