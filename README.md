# SIMEC - Sistema de Monitoramento Escolar de Caraguatatuba

O **SIMEC** é uma plataforma dedicada à gestão centralizada de chamados técnicos e inventário escolar. O sistema otimiza o fluxo de comunicação entre as unidades escolares e a equipe da SEDUC, permitindo o registro, o acompanhamento de demandas e o controle de infraestrutura.

---

##  Funcionalidades Principais
* **Gestão de Chamados:** Abertura, priorização e acompanhamento de chamados técnicos.
* **Inventário Escolar:** Consulta e gestão de infraestrutura (cômodos e equipamentos).
* **Painel de Controle:** Dashboards intuitivos para gestores escolares e administradores SEDUC.
* **Exportação de Relatórios:** Geração de dados em formato CSV para planejamento estratégico.

## Tecnologias e Justificativa
* **JavaScript:** Linguagem base de todo o projeto, permitindo a unificação da lógica.
* **React:** Utilizado para criar interfaces dinâmicas, rápidas e baseadas em componentes.
* **Next.js:** Framework otimizado para performance e estrutura eficiente de rotas.
* **Tailwind CSS:** Ferramenta de estilização para um design consistente.
* **Express:** Framework minimalista e flexível para a construção da API.
* **Prisma:** ORM para manipulação segura e tipada do banco de dados MySQL.

---

## Configuração de Ambiente

### 1. Pré-requisitos
* [Node.js](https://nodejs.org/) (versão LTS)
* [Git](https://git-scm.com/)
* [MySQL Server](https://dev.mysql.com/downloads/installer/) (instalado e em execução)

### 2. Configuração do Banco de Dados
Abra sua ferramenta de gerenciamento do MySQL (Workbench/HeidiSQL) e execute:
```sql
CREATE DATABASE SIMEC;
```

Ou crie da forma que preferir a database com o nome SIMEC.
### 3. Variáveis de Ambiente
Crie um arquivo .env na pasta raiz do projeto do backend com configurações parecidas com estas:
```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=aluno
DATABASE_NAME=SIMEC
DATABASE_URL=mysql://root:aluno@localhost:3306/SIMEC
PORT=3333
JWT_SECRET=2Lti8utkOLTHBRMGlfrMECFbqaEBGsjFYUEKiUxVsyHhuFnK0Sp61ghXZQvw5dnAiFTVU-q0RLbE7xVG-Xfwtg
```
Estas configurações acima são para o ambiente do IFSP por exemplo que é configurado desta forma.

Crie um arquivo .env na pasta /frontend:
```env
API_URL=http://localhost:3333
```

## 🧪 Instruções de Execução
1. **Backend:**
* Acesse a pasta do projeto do backend.
* Rode: npm install.
* Rode as migrações: `npx prisma migrate dev`
* Rode as migrações: `npx prisma generate`
* Crie os usuários de teste, rode este comando: `npx prisma db seed`
* Inicie: `npm run dev`.

2. **Frontend:**
* Entre no projeto do frontend.
* Instale: npm install.
* Inicie: npm run dev.

## 🔑 Credenciais de Acesso (Teste)
| Perfil            | Matrícula (Login) | Senha  |
|-------------------|-------------------|--------|
| **Gestor Escola** | 12345             | 123456 |
| **Gestor Seduc**  | 54321             | 123456 |
