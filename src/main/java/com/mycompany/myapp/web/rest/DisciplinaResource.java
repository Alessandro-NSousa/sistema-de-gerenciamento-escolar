package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Disciplina;
import com.mycompany.myapp.repository.DisciplinaRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Disciplina}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DisciplinaResource {

    private final Logger log = LoggerFactory.getLogger(DisciplinaResource.class);

    private static final String ENTITY_NAME = "disciplina";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DisciplinaRepository disciplinaRepository;

    public DisciplinaResource(DisciplinaRepository disciplinaRepository) {
        this.disciplinaRepository = disciplinaRepository;
    }

    /**
     * {@code POST  /disciplinas} : Create a new disciplina.
     *
     * @param disciplina the disciplina to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new disciplina, or with status {@code 400 (Bad Request)} if the disciplina has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/disciplinas")
    public ResponseEntity<Disciplina> createDisciplina(@Valid @RequestBody Disciplina disciplina) throws URISyntaxException {
        log.debug("REST request to save Disciplina : {}", disciplina);
        if (disciplina.getId() != null) {
            throw new BadRequestAlertException("A new disciplina cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Disciplina result = disciplinaRepository.save(disciplina);
        return ResponseEntity
            .created(new URI("/api/disciplinas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /disciplinas/:id} : Updates an existing disciplina.
     *
     * @param id the id of the disciplina to save.
     * @param disciplina the disciplina to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated disciplina,
     * or with status {@code 400 (Bad Request)} if the disciplina is not valid,
     * or with status {@code 500 (Internal Server Error)} if the disciplina couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/disciplinas/{id}")
    public ResponseEntity<Disciplina> updateDisciplina(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Disciplina disciplina
    ) throws URISyntaxException {
        log.debug("REST request to update Disciplina : {}, {}", id, disciplina);
        if (disciplina.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, disciplina.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!disciplinaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Disciplina result = disciplinaRepository.save(disciplina);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, disciplina.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /disciplinas/:id} : Partial updates given fields of an existing disciplina, field will ignore if it is null
     *
     * @param id the id of the disciplina to save.
     * @param disciplina the disciplina to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated disciplina,
     * or with status {@code 400 (Bad Request)} if the disciplina is not valid,
     * or with status {@code 404 (Not Found)} if the disciplina is not found,
     * or with status {@code 500 (Internal Server Error)} if the disciplina couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/disciplinas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Disciplina> partialUpdateDisciplina(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Disciplina disciplina
    ) throws URISyntaxException {
        log.debug("REST request to partial update Disciplina partially : {}, {}", id, disciplina);
        if (disciplina.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, disciplina.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!disciplinaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Disciplina> result = disciplinaRepository
            .findById(disciplina.getId())
            .map(existingDisciplina -> {
                if (disciplina.getNome() != null) {
                    existingDisciplina.setNome(disciplina.getNome());
                }
                if (disciplina.getDataInicio() != null) {
                    existingDisciplina.setDataInicio(disciplina.getDataInicio());
                }
                if (disciplina.getCargaHoraria() != null) {
                    existingDisciplina.setCargaHoraria(disciplina.getCargaHoraria());
                }
                if (disciplina.getCredito() != null) {
                    existingDisciplina.setCredito(disciplina.getCredito());
                }

                return existingDisciplina;
            })
            .map(disciplinaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, disciplina.getId().toString())
        );
    }

    /**
     * {@code GET  /disciplinas} : get all the disciplinas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of disciplinas in body.
     */
    @GetMapping("/disciplinas")
    public List<Disciplina> getAllDisciplinas() {
        log.debug("REST request to get all Disciplinas");
        return disciplinaRepository.findAll();
    }

    /**
     * {@code GET  /disciplinas/:id} : get the "id" disciplina.
     *
     * @param id the id of the disciplina to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the disciplina, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/disciplinas/{id}")
    public ResponseEntity<Disciplina> getDisciplina(@PathVariable Long id) {
        log.debug("REST request to get Disciplina : {}", id);
        Optional<Disciplina> disciplina = disciplinaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(disciplina);
    }

    /**
     * {@code DELETE  /disciplinas/:id} : delete the "id" disciplina.
     *
     * @param id the id of the disciplina to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/disciplinas/{id}")
    public ResponseEntity<Void> deleteDisciplina(@PathVariable Long id) {
        log.debug("REST request to delete Disciplina : {}", id);
        disciplinaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
