package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Discente;
import com.mycompany.myapp.repository.DiscenteRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Discente}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DiscenteResource {

    private final Logger log = LoggerFactory.getLogger(DiscenteResource.class);

    private static final String ENTITY_NAME = "discente";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DiscenteRepository discenteRepository;

    public DiscenteResource(DiscenteRepository discenteRepository) {
        this.discenteRepository = discenteRepository;
    }

    /**
     * {@code POST  /discentes} : Create a new discente.
     *
     * @param discente the discente to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new discente, or with status {@code 400 (Bad Request)} if the discente has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/discentes")
    public ResponseEntity<Discente> createDiscente(@Valid @RequestBody Discente discente) throws URISyntaxException {
        log.debug("REST request to save Discente : {}", discente);
        if (discente.getId() != null) {
            throw new BadRequestAlertException("A new discente cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Discente result = discenteRepository.save(discente);
        return ResponseEntity
            .created(new URI("/api/discentes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /discentes/:id} : Updates an existing discente.
     *
     * @param id the id of the discente to save.
     * @param discente the discente to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated discente,
     * or with status {@code 400 (Bad Request)} if the discente is not valid,
     * or with status {@code 500 (Internal Server Error)} if the discente couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/discentes/{id}")
    public ResponseEntity<Discente> updateDiscente(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Discente discente
    ) throws URISyntaxException {
        log.debug("REST request to update Discente : {}, {}", id, discente);
        if (discente.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, discente.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!discenteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Discente result = discenteRepository.save(discente);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, discente.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /discentes/:id} : Partial updates given fields of an existing discente, field will ignore if it is null
     *
     * @param id the id of the discente to save.
     * @param discente the discente to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated discente,
     * or with status {@code 400 (Bad Request)} if the discente is not valid,
     * or with status {@code 404 (Not Found)} if the discente is not found,
     * or with status {@code 500 (Internal Server Error)} if the discente couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/discentes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Discente> partialUpdateDiscente(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Discente discente
    ) throws URISyntaxException {
        log.debug("REST request to partial update Discente partially : {}, {}", id, discente);
        if (discente.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, discente.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!discenteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Discente> result = discenteRepository
            .findById(discente.getId())
            .map(existingDiscente -> {
                if (discente.getNome() != null) {
                    existingDiscente.setNome(discente.getNome());
                }
                if (discente.getCpf() != null) {
                    existingDiscente.setCpf(discente.getCpf());
                }
                if (discente.getMatricula() != null) {
                    existingDiscente.setMatricula(discente.getMatricula());
                }
                if (discente.getCurso() != null) {
                    existingDiscente.setCurso(discente.getCurso());
                }
                if (discente.getGenero() != null) {
                    existingDiscente.setGenero(discente.getGenero());
                }

                return existingDiscente;
            })
            .map(discenteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, discente.getId().toString())
        );
    }

    /**
     * {@code GET  /discentes} : get all the discentes.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of discentes in body.
     */
    @GetMapping("/discentes")
    public List<Discente> getAllDiscentes(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Discentes");
        return discenteRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /discentes/:id} : get the "id" discente.
     *
     * @param id the id of the discente to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the discente, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/discentes/{id}")
    public ResponseEntity<Discente> getDiscente(@PathVariable Long id) {
        log.debug("REST request to get Discente : {}", id);
        Optional<Discente> discente = discenteRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(discente);
    }

    /**
     * {@code DELETE  /discentes/:id} : delete the "id" discente.
     *
     * @param id the id of the discente to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/discentes/{id}")
    public ResponseEntity<Void> deleteDiscente(@PathVariable Long id) {
        log.debug("REST request to delete Discente : {}", id);
        discenteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
