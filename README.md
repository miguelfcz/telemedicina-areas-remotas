# Projeto: Telemedicina para Áreas Remotas

Este é o repositório principal do projeto de telemedicina da faculdade. É um monorepo contendo o `frontend` (React + TS) e o `backend` (Node + TS + Prisma).

## 1. Pré-requisitos

Antes de começar, garanta que você tem instalados:
* [Node.js](https://nodejs.org/en/) (v18 ou superior)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (precisa estar **rodando**!)
* [Git](https://git-scm.com/)

## 2. Configuração Inicial (Setup)

Siga estes passos **exatamente** na ordem:

1.  **Clone o projeto:**
    ```bash
    git clone [https://github.com/miguelfcz/telemedicina-areas-remotas.git](https://github.com/miguelfcz/telemedicina-areas-remotas.git)
    cd telemedicina-areas-remotas
    ```

2.  **Configure o Backend:**
    ```bash
    # 1. Entre na pasta do backend
    cd backend
    
    # 2. Copie o .env.example para um .env (ESSENCIAL!)
    # No Windows (CMD/PowerShell):
    copy .env.example .env
    # No Mac/Linux:
    # cp .env.example .env
    
    # 3. Instale as dependências
    npm install
    
    # 4. Volte para a raiz
    cd ..
    ```

3.  **Configure o Frontend:**
    ```bash
    # 1. Entre na pasta do frontend
    cd frontend
    
    # 2. Instale as dependências
    npm install
    
    # 3. Volte para a raiz
    cd ..
    ```

## 3. Como Rodar (Desenvolvimento)

Para programar, você precisará de **3 terminais** (divida seu terminal do VS Code).

* **Terminal 1 (Banco de Dados):** Na **raiz** do projeto, inicie o Postgres no Docker.
    ```bash
    # (Garanta que o Docker Desktop está rodando!)
    docker-compose up
    ```

* **Terminal 2 (Backend):**
    ```bash
    cd backend
    npm run dev
    ```
    * *(API estará rodando em `http://localhost:3000` (ou a porta que definirmos))*

* **Terminal 3 (Frontend):**
    ```bash
    cd frontend
    npm run dev
    ```
    * *(App estará rodando em `http://localhost:5173`)*

## 4. Comandos do Banco de Dados (Prisma)

Qualquer mudança no `backend/prisma/schema.prisma` exige uma "migration".

**IMPORTANTE:** Devido a um bug em como o Windows/PowerShell lê o `.env`, **NÃO use `npx prisma migrate dev`**. Use o script que eu criei no `package.json`:

```bash
# Para rodar uma nova migration (DEPOIS de mudar o schema.prisma)
cd backend
npm run db:migrate

# Para abrir o editor visual do banco
cd backend
npm run db:studio
```
## 5. Fluxo de Trabalho (Git)

* NUNCA dê push direto para o main.

* Crie um branch novo para sua tarefa (ex: feat/grupo1/api-login).

* Faça seu trabalho, "commite" suas mudanças.

* Envie seu branch (git push origin feat/grupo1/api-login).

* Abra um Pull Request (PR) no GitHub.

* Me marque (@miguelfcz) para revisão.
