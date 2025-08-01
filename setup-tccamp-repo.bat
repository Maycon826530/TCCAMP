@echo off
echo Configurando repositorio TCCAMP...

REM Instalar GitHub CLI se necessario
winget install GitHub.cli

REM Fazer login (voce precisara inserir suas credenciais)
gh auth login

REM Criar repositorio
gh repo create TCCAMP --public --description "Site TCCAMP"

REM Navegar para o diretorio do projeto atual
cd /d "Z:\AMP\TCC-AMP"

REM Inicializar git se necessario
git init

REM Adicionar remote
git remote add origin https://github.com/Maycon826530/TCCAMP.git

REM Adicionar arquivos
git add .

REM Primeiro commit
git commit -m "Initial commit - TCCAMP site"

REM Push para GitHub
git push -u origin main

echo Repositorio TCCAMP criado com sucesso!
pause