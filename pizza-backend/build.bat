@echo off
echo Verificando .NET...
dotnet --version
if %errorlevel% neq 0 (
    echo ERRO: .NET nao encontrado!
    echo Baixe em: https://dotnet.microsoft.com/download
    pause
    exit
)

echo Compilando projeto...
dotnet build

echo Publicando para producao...
dotnet publish -c Release -o publish

echo.
echo Arquivos prontos em: publish\
echo Faca upload desta pasta para o Somee
pause