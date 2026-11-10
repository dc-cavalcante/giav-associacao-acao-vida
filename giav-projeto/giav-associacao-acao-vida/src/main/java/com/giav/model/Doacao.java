package com.giav.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "doacao")
public class Doacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descricao;
    
    @Column(name = "descricao_item")
    private String descricaoItem;
    
    @Column(name = "tipo_doacao")
    private String tipoDoacao;
    
    private Integer quantidade;
    
    @Column(name = "data_recebimento")
    private LocalDate dataRecebimento;
    
    @Column(name = "data_doacao")
    private LocalDate dataDoacao;
    
    private String observacoes;

    @ManyToOne
    @JoinColumn(name = "familia_id")
    private Familia familia;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getDescricaoItem() { return descricaoItem; }
    public void setDescricaoItem(String descricaoItem) { this.descricaoItem = descricaoItem; }

    public String getTipoDoacao() { return tipoDoacao; }
    public void setTipoDoacao(String tipoDoacao) { this.tipoDoacao = tipoDoacao; }

    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }

    public LocalDate getDataRecebimento() { return dataRecebimento; }
    public void setDataRecebimento(LocalDate dataRecebimento) { this.dataRecebimento = dataRecebimento; }

    public LocalDate getDataDoacao() { return dataDoacao; }
    public void setDataDoacao(LocalDate dataDoacao) { this.dataDoacao = dataDoacao; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }

    public Familia getFamilia() { return familia; }
    public void setFamilia(Familia familia) { this.familia = familia; }
}