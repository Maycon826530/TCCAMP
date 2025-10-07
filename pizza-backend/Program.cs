using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Security.Cryptography;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();

var app = builder.Build();

app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

string connectionString = "workstation id=tccamp2.mssql.somee.com;packet size=4096;user id=Noc;pwd=12345678;data source=tccamp2.mssql.somee.com;persist security info=False;initial catalog=tccamp2;TrustServerCertificate=True";

app.MapPost("/auth/registro", async ([FromBody] UsuarioRegistro usuario) =>
{
    try
    {
        using var connection = new SqlConnection(connectionString);
        await connection.OpenAsync();
        
        var checkCmd = new SqlCommand("SELECT COUNT(*) FROM usuario WHERE email = @email", connection);
        checkCmd.Parameters.AddWithValue("@email", usuario.email);
        var exists = (int)await checkCmd.ExecuteScalarAsync() > 0;
        
        if (exists)
            return Results.Json(new { erro = "Email já cadastrado" });
        
        var cmd = new SqlCommand(@"INSERT INTO usuario (nome, email, senha, idade, comorbidade, isAdmin, dataCadastro) 
                                  OUTPUT INSERTED.id 
                                  VALUES (@nome, @email, @senha, @idade, @comorbidade, 0, GETDATE())", connection);
        
        cmd.Parameters.AddWithValue("@nome", usuario.nome);
        cmd.Parameters.AddWithValue("@email", usuario.email);
        cmd.Parameters.AddWithValue("@senha", HashSenha(usuario.senha));
        cmd.Parameters.AddWithValue("@idade", usuario.idade ?? 0);
        cmd.Parameters.AddWithValue("@comorbidade", usuario.comorbidade ?? (object)DBNull.Value);
        
        var id = (int)await cmd.ExecuteScalarAsync();
        
        return Results.Json(new { 
            token = $"token-{id}", 
            usuario = new { id, nome = usuario.nome, email = usuario.email } 
        });
    }
    catch
    {
        return Results.Json(new { erro = "Erro interno do servidor" });
    }
});

app.MapPost("/auth/login", async ([FromBody] UsuarioLogin login) =>
{
    try
    {
        using var connection = new SqlConnection(connectionString);
        await connection.OpenAsync();
        
        var cmd = new SqlCommand(@"SELECT id, nome, email, isAdmin FROM usuario 
                                  WHERE (email = @login OR nome = @login) AND senha = @senha", connection);
        cmd.Parameters.AddWithValue("@login", login.email);
        cmd.Parameters.AddWithValue("@senha", HashSenha(login.senha));
        
        using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            return Results.Json(new {
                token = $"token-{reader["id"]}",
                usuario = new { 
                    id = reader["id"], 
                    nome = reader["nome"], 
                    email = reader["email"] 
                },
                isAdmin = (bool)reader["isAdmin"]
            });
        }
        
        return Results.Json(new { erro = "Credenciais inválidas" });
    }
    catch
    {
        return Results.Json(new { erro = "Erro interno do servidor" });
    }
});

app.MapPost("/auth/admin/login", async ([FromBody] UsuarioLogin login) =>
{
    // Mesmo código do login normal
    return await app.Services.GetRequiredService<IServiceProvider>()
        .GetRequiredService<RequestDelegate>()
        .Invoke(new DefaultHttpContext());
});

app.MapGet("/", () => new { message = "Server running", database = "Somee Connected" });

app.Run();

static string HashSenha(string senha)
{
    using var sha256 = SHA256.Create();
    var hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(senha));
    return Convert.ToHexString(hash).ToLower();
}

public record UsuarioRegistro(string nome, string email, string senha, int? idade, string? comorbidade);
public record UsuarioLogin(string email, string senha);