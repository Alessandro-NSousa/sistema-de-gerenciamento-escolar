package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Matricula;
import com.mycompany.myapp.repository.MatriculaRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Matricula}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MatriculaResource {

    private final Logger log = LoggerFactory.getLogger(MatriculaResource.class);

    private static final String ENTITY_NAME = "matricula";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MatriculaRepository matriculaRepository;

    public MatriculaResource(MatriculaRepository matriculaRepository) {
        this.matriculaRepository = matriculaRepository;
    }

    /**
     * {@code POST  /matriculas} : Create a new matricula.
     *
     * @param matricula the matricula to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new matricula, or with status {@code 400 (Bad Request)} if the matricula has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/matriculas")
    public ResponseEntity<Matricula> createMatricula(@RequestBody Matricula matricula) throws URISyntaxException {
        log.debug("REST request to save Matricula : {}", matricula);
        if (matricula.getId() != null) {
            throw new BadRequestAlertException("A new matricula cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Matricula result = matriculaRepository.save(matricula);
        return ResponseEntity
            .created(new URI("/api/matriculas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /matriculas/:id} : Updates an existing matricula.
     *
     * @param id the id of the matricula to save.
     * @param matricula the matricula to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated matricula,
     * or with status {@code 400 (Bad Request)} if the matricula is not valid,
     * or with status {@code 500 (Internal Server Error)} if the matricula couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/matriculas/{id}")
    public ResponseEntity<Matricula> updateMatricula(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Matricula matricula
    ) throws URISyntaxException {
        log.debug("REST request to update Matricula : {}, {}", id, matricula);
        if (matricula.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, matricula.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!matriculaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Matricula result = matriculaRepository.save(matricula);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, matricula.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /matriculas/:id} : Partial updates given fields of an existing matricula, field will ignore if it is null
     *
     * @param id the id of the matricula to save.
     * @param matricula the matricula to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated matricula,
     * or with status {@code 400 (Bad Request)} if the matricula is not valid,
     * or with status {@code 404 (Not Found)} if the matricula is not found,
     * or with status {@code 500 (Internal Server Error)} if the matricula couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/matriculas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Matricula> partialUpdateMatricula(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Matricula matricula
    ) throws URISyntaxException {
        log.debug("REST request to partial update Matricula partially : {}, {}", id, matricula);
        if (matricula.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, matricula.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!matriculaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Matricula> result = matriculaRepository
            .findById(matricula.getId())
            .map(existingMatricula -> {
                if (matricula.getAno() != null) {
                    existingMatricula.setAno(matricula.getAno());
                }
                if (matricula.getNotaFinal() != null) {
                    existingMatricula.setNotaFinal(matricula.getNotaFinal());
                }
                if (matricula.getnFaltas() != null) {
                    existingMatricula.setnFaltas(matricula.getnFaltas());
                }

                return existingMatricula;
            })
            .map(matriculaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, matricula.getId().toString())
        );
    }

    /**
     * {@code GET  /matriculas} : get all the matriculas.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of matriculas in body.
     */
    @GetMapping("/matriculas")
    public List<Matricula> getAllMatriculas(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Matriculas");
        return matriculaRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /matriculas/:id} : get the "id" matricula.
     *
     * @param id the id of the matricula to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the matricula, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/matriculas/{id}")
    public ResponseEntity<Matricula> getMatricula(@PathVariable Long id) {
        log.debug("REST request to get Matricula : {}", id);
        Optional<Matricula> matricula = matriculaRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(matricula);
    }

    /**
     * {@code DELETE  /matriculas/:id} : delete the "id" matricula.
     *
     * @param id the id of the matricula to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/matriculas/{id}")
    public ResponseEntity<Void> deleteMatricula(@PathVariable Long id) {
        log.debug("REST request to delete Matricula : {}", id);
        matriculaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
