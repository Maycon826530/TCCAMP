package com.pizza;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

public interface MedicamentoTomadoRepository extends JpaRepository<MedicamentoTomado, Integer> {
    List<MedicamentoTomado> findByUsuarioId(Integer usuarioId);
    
    @Query("SELECT COUNT(mt) FROM MedicamentoTomado mt WHERE mt.usuario.id = ?1 AND mt.dataHoraTomado >= ?2")
    Long countByUsuarioIdAndDataAfter(Integer usuarioId, LocalDateTime data);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM MedicamentoTomado mt WHERE mt.medicamento.id = ?1")
    void deleteByMedicamentoId(Integer medicamentoId);
}