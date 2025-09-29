package com.pizza;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/medicamentos")
@CrossOrigin(origins = "*")
public class MedicamentoController {
    
    @Autowired
    private MedicamentoRepository medicamentoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private MedicamentoTomadoRepository medicamentoTomadoRepository;
    
    @Autowired
    private HistoricoRepository historicoRepository;
    
    @PostMapping("/marcar-tomado")
    public ResponseEntity<?> marcarComoTomado(@RequestBody Map<String, Object> request) {
        Integer medicamentoId = (Integer) request.get("medicamentoId");
        Integer usuarioId = (Integer) request.get("usuarioId");
        
        Optional<Medicamento> medicamento = medicamentoRepository.findById(medicamentoId);
        Optional<Usuario> usuario = usuarioRepository.findById(usuarioId);
        
        if (!medicamento.isPresent() || !usuario.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Medicamento ou usuário não encontrado"));
        }
        
        Medicamento med = medicamento.get();
        
        // Registrar no histórico
        HistoricoMedicamento historico = new HistoricoMedicamento();
        historico.setUsuario(usuario.get());
        historico.setNomeMedicamento(med.getNome());
        historico.setDosagem(med.getDosagem());
        historico.setAcao("TOMADO");
        historico.setDetalhes(String.format("Medicamento %s %s foi tomado", med.getNome(), med.getDosagem()));
        historicoRepository.save(historico);
        
        return ResponseEntity.ok(Map.of("mensagem", "Medicamento marcado como tomado"));
    }
    
    @GetMapping("/usuario/{usuarioId}")
    public List<Medicamento> listarMedicamentosUsuario(@PathVariable Integer usuarioId) {
        return medicamentoRepository.findByUsuarioId(usuarioId);
    }
    
    @PostMapping
    public ResponseEntity<?> criarMedicamento(@RequestBody Map<String, Object> request) {
        Integer usuarioId = (Integer) request.get("usuarioId");
        Optional<Usuario> usuario = usuarioRepository.findById(usuarioId);
        
        if (!usuario.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Usuário não encontrado"));
        }
        
        Medicamento medicamento = new Medicamento();
        medicamento.setNome((String) request.get("nome"));
        medicamento.setDosagem((String) request.get("dosagem"));
        medicamento.setHorario(LocalTime.parse((String) request.get("horario")));
        medicamento.setFrequencia((String) request.get("frequencia"));
        medicamento.setDuracao((String) request.get("duracao"));
        medicamento.setObservacao((String) request.get("observacao"));
        medicamento.setUsuario(usuario.get());
        
        Medicamento novoMedicamento = medicamentoRepository.save(medicamento);
        
        // Registrar no histórico
        HistoricoMedicamento historico = new HistoricoMedicamento();
        historico.setUsuario(usuario.get());
        historico.setNomeMedicamento(novoMedicamento.getNome());
        historico.setDosagem(novoMedicamento.getDosagem());
        historico.setAcao("ADICIONADO");
        historico.setDetalhes(String.format("Medicamento %s %s adicionado - Horário: %s, Frequência: %s", 
            novoMedicamento.getNome(), novoMedicamento.getDosagem(), 
            novoMedicamento.getHorario(), novoMedicamento.getFrequencia()));
        historicoRepository.save(historico);
        
        return ResponseEntity.ok(novoMedicamento);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarMedicamento(@PathVariable Integer id, @RequestBody Map<String, Object> request) {
        Optional<Medicamento> medicamento = medicamentoRepository.findById(id);
        
        if (!medicamento.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Medicamento não encontrado"));
        }
        
        Medicamento med = medicamento.get();
        
        // Capturar valores antigos para o histórico
        String nomeAntigo = med.getNome();
        String dosagemAntiga = med.getDosagem();
        LocalTime horarioAntigo = med.getHorario();
        String frequenciaAntiga = med.getFrequencia();
        
        med.setNome((String) request.get("nome"));
        med.setDosagem((String) request.get("dosagem"));
        med.setHorario(LocalTime.parse((String) request.get("horario")));
        med.setFrequencia((String) request.get("frequencia"));
        med.setObservacao((String) request.get("observacao"));
        
        Medicamento medicamentoAtualizado = medicamentoRepository.save(med);
        
        // Registrar no histórico
        StringBuilder detalhes = new StringBuilder("Medicamento modificado: ");
        if (!nomeAntigo.equals(med.getNome())) {
            detalhes.append(String.format("Nome: %s → %s; ", nomeAntigo, med.getNome()));
        }
        if (!dosagemAntiga.equals(med.getDosagem())) {
            detalhes.append(String.format("Dosagem: %s → %s; ", dosagemAntiga, med.getDosagem()));
        }
        if (!horarioAntigo.equals(med.getHorario())) {
            detalhes.append(String.format("Horário: %s → %s; ", horarioAntigo, med.getHorario()));
        }
        if (!frequenciaAntiga.equals(med.getFrequencia())) {
            detalhes.append(String.format("Frequência: %s → %s; ", frequenciaAntiga, med.getFrequencia()));
        }
        
        HistoricoMedicamento historico = new HistoricoMedicamento();
        historico.setUsuario(med.getUsuario());
        historico.setNomeMedicamento(med.getNome());
        historico.setDosagem(med.getDosagem());
        historico.setAcao("EDITADO");
        historico.setDetalhes(detalhes.toString());
        historicoRepository.save(historico);
        
        return ResponseEntity.ok(medicamentoAtualizado);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarMedicamento(@PathVariable Integer id) {
        try {
            Optional<Medicamento> medicamento = medicamentoRepository.findById(id);
            if (!medicamento.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("erro", "Medicamento não encontrado"));
            }
            
            Medicamento med = medicamento.get();
            
            // Registrar no histórico antes de deletar
            HistoricoMedicamento historico = new HistoricoMedicamento();
            historico.setUsuario(med.getUsuario());
            historico.setNomeMedicamento(med.getNome());
            historico.setDosagem(med.getDosagem());
            historico.setAcao("EXCLUIDO");
            historico.setDetalhes(String.format("Medicamento %s %s foi excluído", med.getNome(), med.getDosagem()));
            
            System.out.println("Salvando histórico de exclusão: " + med.getNome());
            HistoricoMedicamento historicoSalvo = historicoRepository.save(historico);
            System.out.println("Histórico salvo com ID: " + historicoSalvo.getId());
            
            // Primeiro deletar registros relacionados de medicamentos tomados
            medicamentoTomadoRepository.deleteByMedicamentoId(id);
            
            // Depois deletar o medicamento
            medicamentoRepository.deleteById(id);
            System.out.println("Medicamento deletado: " + id);
            
            return ResponseEntity.ok(Map.of("mensagem", "Medicamento deletado com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Erro ao deletar medicamento"));
        }
    }
}