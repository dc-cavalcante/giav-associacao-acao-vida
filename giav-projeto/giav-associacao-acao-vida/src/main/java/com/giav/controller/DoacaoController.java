package com.giav.controller;

import com.giav.model.Doacao;
import com.giav.repository.DoacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doacoes")
@CrossOrigin(origins = "*") // Garante que o frontend tem acesso livre à API
public class DoacaoController {

    @Autowired
    private DoacaoRepository doacaoRepository;

    @GetMapping
    public List<Doacao> listar() {
        return doacaoRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Doacao> criar(@RequestBody Doacao doacao) {
        try {
            // Se a família enviada tiver ID nulo, desassocia para evitar erros de chave estrangeira
            if (doacao.getFamilia() != null && doacao.getFamilia().getId() == null) {
                doacao.setFamilia(null);
            }
            Doacao salva = doacaoRepository.save(doacao);
            return ResponseEntity.ok(salva);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}