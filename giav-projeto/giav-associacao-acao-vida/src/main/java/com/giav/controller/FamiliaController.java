package com.giav.controller;

import com.giav.model.Familia;
import com.giav.repository.FamiliaRepository;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/familias")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class FamiliaController {

    private final FamiliaRepository familiaRepository;

    // Injeção via construtor (recomendada pelo Spring)
    public FamiliaController(FamiliaRepository familiaRepository) {
        this.familiaRepository = familiaRepository;
    }

    // Endpoint GET para listar todas as famílias cadastradas
    @GetMapping
    public List<Familia> listarTodos() {
        return familiaRepository.findAll();
    }

    // Endpoint POST para criar uma nova família
    @PostMapping
public ResponseEntity<Familia> criar(@RequestBody @Valid Familia familia) {
    Familia novaFamilia = familiaRepository.save(familia);
    return ResponseEntity.status(HttpStatus.CREATED).body(novaFamilia);
}
}