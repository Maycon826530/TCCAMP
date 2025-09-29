package com.pizza;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HistoricoRepository extends JpaRepository<HistoricoMedicamento, Integer> {
    List<HistoricoMedicamento> findByUsuario_IdOrderByDataHoraDesc(Integer usuarioId);
}