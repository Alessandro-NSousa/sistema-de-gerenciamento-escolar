package com.mycompany.myapp.domain;

import com.mycompany.myapp.domain.enumeration.Sexo;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Discente.
 */
@Entity
@Table(name = "discente")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Discente implements Serializable {

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
    @Column(name = "cpf", nullable = false)
    private String cpf;

    @NotNull
    @Column(name = "matricula", nullable = false)
    private Integer matricula;

    @NotNull
    @Column(name = "curso", nullable = false)
    private String curso;

    @Enumerated(EnumType.STRING)
    @Column(name = "genero")
    private Sexo genero;

    @OneToOne
    @JoinColumn(unique = true)
    private Endereco endereco;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Discente id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public Discente nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return this.cpf;
    }

    public Discente cpf(String cpf) {
        this.setCpf(cpf);
        return this;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public Integer getMatricula() {
        return this.matricula;
    }

    public Discente matricula(Integer matricula) {
        this.setMatricula(matricula);
        return this;
    }

    public void setMatricula(Integer matricula) {
        this.matricula = matricula;
    }

    public String getCurso() {
        return this.curso;
    }

    public Discente curso(String curso) {
        this.setCurso(curso);
        return this;
    }

    public void setCurso(String curso) {
        this.curso = curso;
    }

    public Sexo getGenero() {
        return this.genero;
    }

    public Discente genero(Sexo genero) {
        this.setGenero(genero);
        return this;
    }

    public void setGenero(Sexo genero) {
        this.genero = genero;
    }

    public Endereco getEndereco() {
        return this.endereco;
    }

    public void setEndereco(Endereco endereco) {
        this.endereco = endereco;
    }

    public Discente endereco(Endereco endereco) {
        this.setEndereco(endereco);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Discente)) {
            return false;
        }
        return id != null && id.equals(((Discente) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Discente{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", cpf='" + getCpf() + "'" +
            ", matricula=" + getMatricula() +
            ", curso='" + getCurso() + "'" +
            ", genero='" + getGenero() + "'" +
            "}";
    }
}
