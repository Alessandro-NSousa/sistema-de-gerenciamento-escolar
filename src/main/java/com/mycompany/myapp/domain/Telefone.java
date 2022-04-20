package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Telefone.
 */
@Entity
@Table(name = "telefone")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Telefone implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "numero")
    private String numero;

    @ManyToOne
    @ManyToOne
    @JsonIgnoreProperties(value = { "endereco" }, allowSetters = true)
    private Discente discente;

    @ManyToOne
    @ManyToOne
    @JsonIgnoreProperties(value = { "endereco" }, allowSetters = true)
    private Docente discente;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Telefone id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumero() {
        return this.numero;
    }

    public Telefone numero(String numero) {
        this.setNumero(numero);
        return this;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public Discente getDiscente() {
        return this.discente;
    }

    public void setDiscente(Discente discente) {
        this.discente = discente;
    }

    public Telefone discente(Discente discente) {
        this.setDiscente(discente);
        return this;
    }

    public Docente getDiscente() {
        return this.discente;
    }

    public void setDiscente(Docente docente) {
        this.discente = docente;
    }

    public Telefone discente(Docente docente) {
        this.setDiscente(docente);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Telefone)) {
            return false;
        }
        return id != null && id.equals(((Telefone) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Telefone{" +
            "id=" + getId() +
            ", numero='" + getNumero() + "'" +
            "}";
    }
}
