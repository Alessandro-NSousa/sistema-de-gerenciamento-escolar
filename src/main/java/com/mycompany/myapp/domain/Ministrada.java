package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Ministrada.
 */
@Entity
@Table(name = "ministrada")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Ministrada implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "ano")
    private LocalDate ano;

    @Column(name = "ch")
    private Integer ch;

    @ManyToOne
    private Disciplina disciplna;

    @ManyToOne
    @JsonIgnoreProperties(value = { "endereco" }, allowSetters = true)
    private Docente docente;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Ministrada id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getAno() {
        return this.ano;
    }

    public Ministrada ano(LocalDate ano) {
        this.setAno(ano);
        return this;
    }

    public void setAno(LocalDate ano) {
        this.ano = ano;
    }

    public Integer getCh() {
        return this.ch;
    }

    public Ministrada ch(Integer ch) {
        this.setCh(ch);
        return this;
    }

    public void setCh(Integer ch) {
        this.ch = ch;
    }

    public Disciplina getDisciplna() {
        return this.disciplna;
    }

    public void setDisciplna(Disciplina disciplina) {
        this.disciplna = disciplina;
    }

    public Ministrada disciplna(Disciplina disciplina) {
        this.setDisciplna(disciplina);
        return this;
    }

    public Docente getDocente() {
        return this.docente;
    }

    public void setDocente(Docente docente) {
        this.docente = docente;
    }

    public Ministrada docente(Docente docente) {
        this.setDocente(docente);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ministrada)) {
            return false;
        }
        return id != null && id.equals(((Ministrada) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Ministrada{" +
            "id=" + getId() +
            ", ano='" + getAno() + "'" +
            ", ch=" + getCh() +
            "}";
    }
}
