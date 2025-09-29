package com.pizza;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "medicamento_tomado")
public class MedicamentoTomado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "medicamento_id", nullable = false)
    private Medicamento medicamento;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @Column(nullable = false)
    private LocalDateTime dataHoraTomado;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Medicamento getMedicamento() { return medicamento; }
    public void setMedicamento(Medicamento medicamento) { this.medicamento = medicamento; }
    
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    
    public LocalDateTime getDataHoraTomado() { return dataHoraTomado; }
    public void setDataHoraTomado(LocalDateTime dataHoraTomado) { this.dataHoraTomado = dataHoraTomado; }
}