# Portal Synthetica — Acervo Digital da Memória Cultural & Tecnológica

> Museu digital interativo focado na preservação de memórias culturais, estéticas e tecnológicas das categorias de **Dança, Música, Cinema, Artes Plásticas e Eletrônicos**. Integra curadoria analógica, modelos 3D, reprodução em vinil e um subsistema desacoplado de comentários comunitários.

---

## 1. Arquitetura da Solução

O projeto adota uma arquitetura em microsserviços desacoplados:

```text
┌─────────────────────────────────────────────────────────────┐
│                      NAVEGADOR (CLIENT)                     │
│                                                             │
│   Portal Synthetica (React 19 + TypeScript + Vite + Tailwind)│
│                     Porta: 3000                             │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               │ HTTP / JSON                   │ HTTP / JSON
               │ (Endpoints IA / Express)      │ (CRUD Comentários / FastAPI)
               ▼                               ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐
│       SERVIDOR FRONTEND      │ │       BACKEND DE COMENTÁRIOS │
│       (Express + Vite)       │ │       (FastAPI + Uvicorn)    │
│         Porta: 3000          │ │         Porta: 8000          │
│                              │ │                              │
│  - Assets e SPA Fallback     │ │  - CRUD Completo de Coment.  │
│  - Análise Curatorial (IA)   │ │  - Validação de Autoria      │
│  - Roteiro de Visitação (IA) │ │  - Restrição de Integridade  │
│  - Recomendações (IA)        │ │  - MER Tabela COMENTARIO     │
└──────────────────────────────┘ └──────────────────────────────┘
```

* **Frontend (Porta 3000)**: Aplicação SPA em React 19 com Vite, estilização em Tailwind CSS, gestão de acervo em memória (não persistindo comentários no `localStorage`), visualizadores interativos e componentes acessíveis com suporte a leitor de tela e síntese de voz.
* **Backend de Comentários (Porta 8000)**: API RESTful construída com FastAPI e Python 3.11, com CORS configurado para `http://localhost:3000`, modelos Pydantic estritos e armazenamento estruturado que espelha fielmente o Modelo de Entidade e Relacionamento (MER).

---

## 2. Mapeamento para o Modelo de Dados (MER — Tabela COMENTARIO)

A API de comentários foi projetada como a realização em software da entidade relacional `COMENTARIO` da disciplina de **Database Application**:

| Coluna Relacional (MER / DDL) | Tipo no Banco (SQL) | Campo Pydantic / TypeScript | Descrição Curatorial & Regra de Negócio |
| :--- | :--- | :--- | :--- |
| `ID_COMENTARIO` | `NUMBER` / `SERIAL PK` | `id_comentario: int` | Identificador único e sequencial da tupla de comentário. |
| `ID_CONTEUDO` | `VARCHAR2(50) FK` | `id_conteudo: str` | Identificador da obra/dispositivo do acervo (ex: `syn-mus-01`). |
| `ID_USUARIO` | `NUMBER FK` | `id_usuario: int` | Identificador do usuário que redigiu a reflexão (ex: `1` para Sofia Valente). |
| `AUTOR_NOME` | `VARCHAR2(100)` | `autor_nome: str` | Nome de exibição curatorial do autor do comentário. |
| `TEXTO` | `VARCHAR2(1000)` | `texto: str` | Corpo textual da reflexão (não vazio, máximo de 1000 caracteres). |
| `DATA_COMENTARIO` | `TIMESTAMP` / `ISO 8601` | `data_comentario: str` | Data e hora exata do registro do comentário no acervo. |
| `EDITADO` | `NUMBER(1)` / `BOOLEAN`| `editado: bool` | Indicador booleano de integridade (`true` após qualquer alteração via PUT). |
| `CURTIDAS` | `NUMBER DEFAULT 0` | `curtidas: int` | Total de reações e endossos recebidos pela comunidade do acervo. |

---

## 3. Instalação e Execução

Para executar o projeto completo com ambos os serviços ativos:

### Pré-requisitos
- **Node.js**: v18 ou superior
- **Python**: v3.10 ou superior (`python3`, `pip`)

### Passo 1: Instalação das Dependências do Backend (FastAPI)
```bash
# Instalar pacotes Python (FastAPI, Uvicorn, Pydantic)
pip install -r backend/requirements.txt
```

### Passo 2: Instalação das Dependências do Frontend (React)
```bash
# Instalar dependências npm do frontend
npm install
```

### Passo 3: Executar o Backend FastAPI (Porta 8000)
Em um terminal dedicado, execute:
```bash
uvicorn backend.main:app --reload --port 8000
```
> O backend estará acessível em `http://localhost:8000` com documentação interativa OpenAPI Swagger em `http://localhost:8000/docs`.

### Passo 4: Executar o Frontend React (Porta 3000)
Em outro terminal, execute:
```bash
npm run dev
```
> O frontend estará acessível em `http://localhost:3000`.

---

## 4. Especificação da API REST de Comentários

Todos os endpoints utilizam formato JSON e seguem as convenções RESTful:

### `GET /api/conteudos/{id_conteudo}/comentarios`
Lista todos os comentários vinculados a uma obra ou dispositivo específico do acervo.
* **Parâmetro de URL**: `id_conteudo` (string, ex: `syn-mus-01`)
* **Ordenação**: Cronológica crescente (do mais antigo para o mais recente).
* **Respostas**:
  * `200 OK`: Retorna lista de comentários em formato JSON:
    ```json
    [
      {
        "id_comentario": 1,
        "id_conteudo": "syn-mus-01",
        "id_usuario": 102,
        "autor_nome": "Rodrigo Alvim",
        "texto": "A passagem de acordes de \"O Trem Azul\" ainda soa 50 anos à frente do nosso tempo...",
        "data_comentario": "2026-09-02T10:15:00Z",
        "editado": false,
        "curtidas": 24
      }
    ]
    ```

---

### `POST /api/conteudos/{id_conteudo}/comentarios`
Cria e publica um novo comentário para a obra especificada.
* **Parâmetro de URL**: `id_conteudo` (string)
* **Corpo da Requisição (`application/json`)**:
  ```json
  {
    "id_usuario": 1,
    "autor_nome": "Sofia Valente",
    "texto": "Reflexão sobre a gravação com fita magnética e microfones valvulados."
  }
  ```
* **Respostas**:
  * `201 Created`: Comentário criado com sucesso com os campos `id_comentario`, `data_comentario` e `editado: false`.
  * `404 Not Found`: Caso a obra não exista no catálogo.
  * `422 Unprocessable Entity`: Caso o texto seja vazio ou exceda 1000 caracteres.

---

### `PUT /api/comentarios/{id_comentario}`
Atualiza o texto de um comentário existente.
* **Parâmetro de URL**: `id_comentario` (inteiro)
* **Corpo da Requisição (`application/json`)**:
  ```json
  {
    "id_usuario": 1,
    "texto": "Texto refinado após consulta ao catálogo do museu."
  }
  ```
* **Regra de Autoria**: O `id_usuario` enviado no corpo deve coincidir com o autor original da tupla.
* **Respostas**:
  * `200 OK`: Comentário atualizado, com `editado: true`.
  * `403 Forbidden`: Se o usuário não for o autor original do comentário.
  * `404 Not Found`: Comentário não localizado.
  * `422 Unprocessable Entity`: Texto inválido ou acima de 1000 caracteres.

---

### `DELETE /api/comentarios/{id_comentario}`
Remove permanentemente um comentário do acervo.
* **Parâmetro de URL**: `id_comentario` (inteiro)
* **Query Parameter ou Header**: `id_usuario` (inteiro, ex: `/api/comentarios/3?id_usuario=1`)
* **Regra de Autoria**: Apenas o autor original pode solicitar a exclusão do registro.
* **Respostas**:
  * `204 No Content`: Comentário excluído com sucesso (sem corpo de retorno).
  * `403 Forbidden`: Se a exclusão for solicitada por outro usuário.
  * `404 Not Found`: Comentário inexistente.

---

### `POST /api/comentarios/{id_comentario}/curtida`
Alterna reação/curtida em um comentário (toggle).
* **Parâmetro de URL**: `id_comentario` (inteiro)
* **Corpo da Requisição (`application/json`)**:
  ```json
  {
    "id_usuario": 1
  }
  ```
* **Respostas**:
  * `200 OK`: Retorna o número atualizado de curtidas e o estado (`curtido: true/false`).

---

## 5. Decisões Técnicas e Arquiteturais

### 1. Validação Estrita de Autoria (HTTP 403 Forbidden)
- Para cumprir os princípios de integridade referencial e segurança de dados, nenhum usuário pode alterar ou remover contribuições de outros visitantes.
- Tanto a rota `PUT` quanto a rota `DELETE` verificam se o `id_usuario` recebido corresponde ao autor gravado na tupla original. Tentativas de adulteração por outros IDs resultam em recusa imediata com status `403 Forbidden` e mensagem explicativa.

### 2. Restrição de Integridade (Limite de 1000 Caracteres)
- Correspondendo fielmente à especificação da coluna `VARCHAR2(1000)` do banco de dados relacional, tanto o backend (via validador Pydantic `min_length=1`, `max_length=1000`) quanto o frontend (via atributo `maxLength={1000}` e contador numérico em tempo real com barra de progresso visual) impedem textos vazios ou prolixos demais.

### 3. Desacoplamento da Persistência (Remoção de Comentários do `localStorage`)
- O estado de comentários deixou de ser gravado no navegador via `localStorage`. Apenas metadados de preferências do acervo continuam em cache local. Os comentários são dinamicamente buscados da API FastAPI sempre que um item é aberto em modal.

### 4. Resiliência e Feedback Amigável ao Usuário
- O cliente de API `src/utils/comentariosApi.ts` intercepta falhas de rede (`Failed to fetch`, recusa de conexão) e converte em mensagens humanas em português com instruções de diagnóstico (verificar porta 8000), garantindo que a interface nunca quebre ou apresente erros crus de console.
- A interface exibe spinners de carregamento, alertas com fechamento manual, botões de confirmação de exclusão em duas etapas e badge sutil de "editado" para comentários alterados.
