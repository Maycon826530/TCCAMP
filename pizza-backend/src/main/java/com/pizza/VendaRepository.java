package com.pizza;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistoricoMedicamentoRepository extends JpaRepository<HistoricoMedicamento, Integer> {
    List<HistoricoMedicamento> findByUsuarioId(Integer usuarioId);
    List<HistoricoMedicamento> findByMedicamentoId(Integer medicamentoId);
}