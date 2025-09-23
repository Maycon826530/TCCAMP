package com.pizza;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historico_medicamento")
public class HistoricoMedicamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @ManyToOne
    @JoinColumn(name = "medicamento_id", nullable = false)
    private Medicamento medicamento;
    
    @Column(nullable = false)
    private LocalDateTime dataTomada = LocalDateTime.now();
    
    @Column(nullable = false)
    private Boolean tomado = true;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    
    public Medicamento getMedicamento() { return medicamento; }
    public void setMedicamento(Medicamento medicamento) { this.medicamento = medicamento; }
    
    public LocalDateTime getDataTomada() { return dataTomada; }
    public void setDataTomada(LocalDateTime dataTomada) { this.dataTomada = dataTomada; }
    
    public Boolean getTomado() { return tomado; }
    public void setTomado(Boolean tomado) { this.tomado = tomado; }
}