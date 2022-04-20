package com.mycompany.myapp.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Disciplina.
 */
@Entity
@Table(name = "disciplina")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Disciplina implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nome", nullable = false)
    private String nome;

    @NotNull
    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @NotNull
    @Column(name = "carga_horaria", nullable = false)
    private Integer cargaHoraria;

    @Column(name = "credito")
    private Integer credito;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Disciplina id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public Disciplina nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public LocalDate getDataInicio() {
        return this.dataInicio;
    }

    public Disciplina dataInicio(LocalDate dataInicio) {
        this.setDataInicio(dataInicio);
        return this;
    }

    public void setDataInicio(LocalDate dataInicio) {
        this.dataInicio = dataInicio;
    }

    public Integer getCargaHoraria() {
        return this.cargaHoraria;
    }

    public Disciplina cargaHoraria(Integer cargaHoraria) {
        this.setCargaHoraria(cargaHoraria);
        return this;
    }

    public void setCargaHoraria(Integer cargaHoraria) {
        this.cargaHoraria = cargaHoraria;
    }

    public Integer getCredito() {
        return this.credito;
    }

    public Disciplina credito(Integer credito) {
        this.setCredito(credito);
        return this;
    }

    public void setCredito(Integer credito) {
        this.credito = credito;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Disciplina)) {
            return false;
        }
        return id != null && id.equals(((Disciplina) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Disciplina{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", dataInicio='" + getDataInicio() + "'" +
            ", cargaHoraria=" + getCargaHoraria() +
            ", credito=" + getCredito() +
            "}";
    }
}
