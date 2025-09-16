# Medication Management Backend API

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

## Executar
```bash
mvn spring-boot:run
```

## Banco de Dados
- Servidor: tccamp1.mssql.somee.com
- Banco: tccamp1
- Usuário: tccamp
- Senha: 12345678