# HeatSpot OFF-Grid — Instruções para executar o projeto

Este repositório usa Vite + React. Abaixo há duas opções completas para rodar o projeto: via Docker (sem instalar Node no Windows) ou localmente instalando Node.

## Opção A — Usar Docker (recomendado se não quiser instalar Node)
Requisitos: Docker Desktop instalado e em execução.

1. No terminal (PowerShell) na pasta do projeto execute:

```powershell
docker compose up --build
```

2. Abra no navegador:

http://localhost:5173

3. Para parar o servidor:

```powershell
docker compose down
```

Observações:
- O `docker-compose.yml` já está configurado para montar seu diretório no container e expor a porta `5173`.
- Se preferir iniciar com um comando direto, use o `start-dev.bat` (duplo-clique ou execute no PowerShell):

```powershell
start-dev.bat
```

## Opção B — Instalar Node no Windows (melhor para desenvolvimento contínuo)
Recomendo `nvm-windows` para gerir versões do Node.

1. Baixe e instale `nvm-windows` (instalador):
	- https://github.com/coreybutler/nvm-windows/releases

2. Abra um novo PowerShell (após instalar o nvm) e execute:

```powershell
nvm install 18.19.0
nvm use 18.19.0
node -v
npm -v
```

3. Na pasta do projeto:

```powershell
npm install
npm run dev
```

4. Abra no navegador:

http://localhost:5173

## Build para produção
Localmente:

```powershell
npm run build
npm run preview
```

Via Docker (gera o `dist` no host):

```powershell
docker run --rm -v ${PWD}:/app -w /app node:25-bullseye sh -c "npm install && npm run build"
```

## Dicas e solução de problemas
- Se receber erro `The term 'node' is not recognized...`, significa que `node` não está instalado no host. Use a Opção A (Docker) ou siga a Opção B para instalar Node.
- Se usar Docker e tiver problemas com `node_modules` nativos, troque para a imagem `node:25-bullseye` no `docker-compose.yml` (mais parecida com Debian).
- Para ver scripts definidos, confira `package.json` — já tem os scripts `dev`, `build` e `preview`.

---
Se quiser, eu executo os comandos Docker Compose por si (se autorizar) ou guio-o passo a passo para instalar `nvm-windows` e configurar o ambiente local.

Run locally:

```
npm install
npm run dev
```

Build for production:

```
npm run build
npm run preview
```

This project uses Vite + React. Files of interest:
- [main.jsx](main.jsx#L1)
- [App.jsx](App.jsx#L1)
- [pages/Home.jsx](pages/Home.jsx#L1)
