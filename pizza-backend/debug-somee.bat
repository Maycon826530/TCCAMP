@echo off
echo === DEBUG SERVIDOR SOMEE ===
set DB_URL=jdbc:sqlserver://tccamp2.mssql.somee.com:1433;databaseName=tccamp2;encrypt=true;trustServerCertificate=true
set DB_USERNAME=Noc
set DB_PASSWORD=12345678

echo Compilando versao debug...
javac -cp "sqljdbc_13.2.0.0_ptb.zip" SimpleServerDebug.java

echo Executando com logs...
java -cp ".;sqljdbc_13.2.0.0_ptb.zip" SimpleServerDebug
pause