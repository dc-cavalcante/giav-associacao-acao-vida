package com.giav.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "familia")
public class Familia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do responsável é obrigatório")
    @Column(nullable = false)
    private String nomeResponsavel;

    @NotBlank(message = "O CPF é obrigatório")
    @Column(nullable = false, unique = true)
    private String cpf;

    private String telefone;
    private String endereco;
    
    @NotNull(message = "A quantidade de membros é obrigatória")
    @Column(nullable = false)
    private Integer quantidadeMembros;

    @NotNull(message = "A data de cadastro é obrigatória")
    @Column(nullable = false)
    private LocalDate dataCadastro;

    // Construtores
    public Familia() {}

    // Getters e Setters mantêm-se iguais...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNomeResponsavel() { return nomeResponsavel; }
    public void setNomeResponsavel(String nomeResponsavel) { this.nomeResponsavel = nomeResponsavel; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public Integer getQuantidadeMembros() { return quantidadeMembros; }
    public void setQuantidadeMembros(Integer quantidadeMembros) { this.quantidadeMembros = quantidadeMembros; }

    public LocalDate getDataCadastro() { return dataCadastro; }
    public void setDataCadastro(LocalDate dataCadastro) { this.dataCadastro = dataCadastro; }
}