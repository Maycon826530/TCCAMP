# PharmaLife Backend API

## 🔒 Configuração de Segurança

### Variáveis de Ambiente
Antes de executar, configure as variáveis de ambiente:

1. Copie o arquivo `.env.example` para `.env`
2. Configure suas credenciais:

```bash
# Banco de Dados
DB_URL=jdbc:sqlserver://seu-servidor:1433;databaseName=seu-banco;encrypt=true;trustServerCertificate=true
DB_USERNAME=seu-usuario
DB_PASSWORD=sua-senha

# JWT
JWT_SECRET=sua-chave-secreta-muito-forte
JWT_EXPIRATION=86400000
```

⚠️ **NUNCA** commite credenciais no código!

## Endpoints

### Autenticação
- `POST /auth/login` - Login
- `POST /auth/registro` - Registro
- `POST /auth/esqueci-senha` - Esqueci senha

### Medicamentos
- `GET /medicamentos/usuario/{usuarioId}` - Listar medicamentos do usuário
- `POST /medicamentos` - Criar medicamento
- `PUT /medicamentos/{id}` - Atualizar medicamento
- `DELETE /medicamentos/{id}` - Deletar medicamento

### Histórico
- `POST /historico/marcar-tomado` - Marcar medicamento como tomado
- `GET /historico/usuario/{usuarioId}` - Histórico do usuário
- `GET /historico/medicamento/{medicamentoId}` - Histórico do medicamento

### Lembretes
- `GET /lembretes/usuario/{usuarioId}` - Listar lembretes do usuário
- `POST /lembretes` - Criar lembrete
- `DELETE /lembretes/{id}` - Deletar lembrete

## 🚀 Executar

### Desenvolvimento
```bash
# Configurar variáveis de ambiente
export DB_URL="sua-url-do-banco"
export DB_USERNAME="seu-usuario"
export DB_PASSWORD="sua-senha"

# Executar aplicação
mvn spring-boot:run
```

### Produção
```bash
# Usar arquivo .env ou configurar no sistema
mvn clean package
java -jar target/pizza-backend-1.0.0.jar
```

## 📊 Banco de Dados
- As credenciais agora são configuradas via variáveis de ambiente
- Veja o arquivo `.env.example` para referência
- Nunca exponha credenciais no código fonte