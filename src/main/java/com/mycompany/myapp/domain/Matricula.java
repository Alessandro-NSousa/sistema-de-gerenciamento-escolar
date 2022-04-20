package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Matricula.
 */
@Entity
@Table(name = "matricula")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Matricula implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "ano")
    private LocalDate ano;

    @Column(name = "nota_final")
    private Double notaFinal;

    @Column(name = "n_faltas")
    private Integer nFaltas;

    @ManyToOne
    @JsonIgnoreProperties(value = { "endereco" }, allowSetters = true)
    private Discente discente;

    @ManyToOne
    private Disciplina disciplna;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Matricula id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getAno() {
        return this.ano;
    }

    public Matricula ano(LocalDate ano) {
        this.setAno(ano);
        return this;
    }

    public void setAno(LocalDate ano) {
        this.ano = ano;
    }

    public Double getNotaFinal() {
        return this.notaFinal;
    }

    public Matricula notaFinal(Double notaFinal) {
        this.setNotaFinal(notaFinal);
        return this;
    }

    public void setNotaFinal(Double notaFinal) {
        this.notaFinal = notaFinal;
    }

    public Integer getnFaltas() {
        return this.nFaltas;
    }

    public Matricula nFaltas(Integer nFaltas) {
        this.setnFaltas(nFaltas);
        return this;
    }

    public void setnFaltas(Integer nFaltas) {
        this.nFaltas = nFaltas;
    }

    public Discente getDiscente() {
        return this.discente;
    }

    public void setDiscente(Discente discente) {
        this.discente = discente;
    }

    public Matricula discente(Discente discente) {
        this.setDiscente(discente);
        return this;
    }

    public Disciplina getDisciplna() {
        return this.disciplna;
    }

    public void setDisciplna(Disciplina disciplina) {
        this.disciplna = disciplina;
    }

    public Matricula disciplna(Disciplina disciplina) {
        this.setDisciplna(disciplina);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Matricula)) {
            return false;
        }
        return id != null && id.equals(((Matricula) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Matricula{" +
            "id=" + getId() +
            ", ano='" + getAno() + "'" +
            ", notaFinal=" + getNotaFinal() +
            ", nFaltas=" + getnFaltas() +
            "}";
    }
}
