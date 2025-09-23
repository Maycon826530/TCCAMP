package com.pharmalife;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByEmail(String email);
    long countByUltimoLoginAfter(LocalDateTime data);
    long countByDataCadastroAfter(LocalDateTime data);
}