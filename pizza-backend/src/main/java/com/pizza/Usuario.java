package com.pizza;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, length = 200)
    private String nome;
    
    @Column(nullable = false, length = 200, unique = true)
    private String email;
    
    @Column(nullable = false, length = 255)
    private String senha;
    
    @Column(nullable = false)
    private Boolean isAdmin = false;
    
    @Column(nullable = false)
    private LocalDateTime dataCadastro = LocalDateTime.now();
    
    @Column
    private LocalDateTime ultimoLogin;
    
    @Column
    private Integer idade;
    
    @Column(length = 500)
    private String comorbidade;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    
    public Boolean getIsAdmin() { return isAdmin; }
    public void setIsAdmin(Boolean isAdmin) { this.isAdmin = isAdmin; }
    
    public LocalDateTime getDataCadastro() { return dataCadastro; }
    public void setDataCadastro(LocalDateTime dataCadastro) { this.dataCadastro = dataCadastro; }
    
    public LocalDateTime getUltimoLogin() { return ultimoLogin; }
    public void setUltimoLogin(LocalDateTime ultimoLogin) { this.ultimoLogin = ultimoLogin; }
    
    public Integer getIdade() { return idade; }
    public void setIdade(Integer idade) { this.idade = idade; }
    
    public String getComorbidade() { return comorbidade; }
    public void setComorbidade(String comorbidade) { this.comorbidade = comorbidade; }
}