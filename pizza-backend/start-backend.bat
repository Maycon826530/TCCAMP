@echo off
echo Parando processos na porta 8080...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080') do taskkill /f /pid %%a 2>nul

echo Iniciando servidor Spring Boot...
cd /d "%~dp0"

REM Tentar executar o JAR se existir
if exist "target\pizza-backend-1.0.0.jar" (
    echo Executando JAR...
    java -jar target\pizza-backend-1.0.0.jar
) else (
    echo JAR não encontrado, executando classe principal...
    java -cp "target\classes" com.pizza.PizzaApplication
)

pause