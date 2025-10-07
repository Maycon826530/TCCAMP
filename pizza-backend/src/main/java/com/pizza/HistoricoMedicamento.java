package com.pizza;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historico_medicamento")
public class HistoricoMedicamento {
    
    public enum TipoAcao {
        ADICIONADO, EDITADO, EXCLUIDO, TOMADO
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @Column(nullable = false)
    private String nomeMedicamento;
    
    @Column
    private String dosagem;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoAcao acao;
    
    @Column(columnDefinition = "TEXT")
    private String detalhes;
    
    @Column(nullable = false)
    private LocalDateTime dataHora = LocalDateTime.now();

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    
    public String getNomeMedicamento() { return nomeMedicamento; }
    public void setNomeMedicamento(String nomeMedicamento) { this.nomeMedicamento = nomeMedicamento; }
    
    public String getDosagem() { return dosagem; }
    public void setDosagem(String dosagem) { this.dosagem = dosagem; }
    
    public TipoAcao getAcao() { return acao; }
    public void setAcao(TipoAcao acao) { this.acao = acao; }
    
    public void setAcao(String acao) {
        this.acao = TipoAcao.valueOf(acao);
    }
    
    public String getDetalhes() { return detalhes; }
    public void setDetalhes(String detalhes) { this.detalhes = detalhes; }
    
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
}