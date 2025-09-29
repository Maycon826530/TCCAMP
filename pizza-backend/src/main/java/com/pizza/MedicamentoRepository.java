package com.pizza;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicamentoRepository extends JpaRepository<Medicamento, Integer> {
    List<Medicamento> findByUsuarioId(Integer usuarioId);
    Long countByUsuarioId(Integer usuarioId);
}