package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Telefone;
import com.mycompany.myapp.repository.TelefoneRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Telefone}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TelefoneResource {

    private final Logger log = LoggerFactory.getLogger(TelefoneResource.class);

    private static final String ENTITY_NAME = "telefone";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TelefoneRepository telefoneRepository;

    public TelefoneResource(TelefoneRepository telefoneRepository) {
        this.telefoneRepository = telefoneRepository;
    }

    /**
     * {@code POST  /telefones} : Create a new telefone.
     *
     * @param telefone the telefone to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new telefone, or with status {@code 400 (Bad Request)} if the telefone has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/telefones")
    public ResponseEntity<Telefone> createTelefone(@RequestBody Telefone telefone) throws URISyntaxException {
        log.debug("REST request to save Telefone : {}", telefone);
        if (telefone.getId() != null) {
            throw new BadRequestAlertException("A new telefone cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Telefone result = telefoneRepository.save(telefone);
        return ResponseEntity
            .created(new URI("/api/telefones/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /telefones/:id} : Updates an existing telefone.
     *
     * @param id the id of the telefone to save.
     * @param telefone the telefone to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated telefone,
     * or with status {@code 400 (Bad Request)} if the telefone is not valid,
     * or with status {@code 500 (Internal Server Error)} if the telefone couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/telefones/{id}")
    public ResponseEntity<Telefone> updateTelefone(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Telefone telefone
    ) throws URISyntaxException {
        log.debug("REST request to update Telefone : {}, {}", id, telefone);
        if (telefone.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, telefone.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!telefoneRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Telefone result = telefoneRepository.save(telefone);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, telefone.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /telefones/:id} : Partial updates given fields of an existing telefone, field will ignore if it is null
     *
     * @param id the id of the telefone to save.
     * @param telefone the telefone to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated telefone,
     * or with status {@code 400 (Bad Request)} if the telefone is not valid,
     * or with status {@code 404 (Not Found)} if the telefone is not found,
     * or with status {@code 500 (Internal Server Error)} if the telefone couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/telefones/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Telefone> partialUpdateTelefone(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Telefone telefone
    ) throws URISyntaxException {
        log.debug("REST request to partial update Telefone partially : {}, {}", id, telefone);
        if (telefone.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, telefone.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!telefoneRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Telefone> result = telefoneRepository
            .findById(telefone.getId())
            .map(existingTelefone -> {
                if (telefone.getNumero() != null) {
                    existingTelefone.setNumero(telefone.getNumero());
                }

                return existingTelefone;
            })
            .map(telefoneRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, telefone.getId().toString())
        );
    }

    /**
     * {@code GET  /telefones} : get all the telefones.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of telefones in body.
     */
    @GetMapping("/telefones")
    public List<Telefone> getAllTelefones(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Telefones");
        return telefoneRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /telefones/:id} : get the "id" telefone.
     *
     * @param id the id of the telefone to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the telefone, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/telefones/{id}")
    public ResponseEntity<Telefone> getTelefone(@PathVariable Long id) {
        log.debug("REST request to get Telefone : {}", id);
        Optional<Telefone> telefone = telefoneRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(telefone);
    }

    /**
     * {@code DELETE  /telefones/:id} : delete the "id" telefone.
     *
     * @param id the id of the telefone to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/telefones/{id}")
    public ResponseEntity<Void> deleteTelefone(@PathVariable Long id) {
        log.debug("REST request to delete Telefone : {}", id);
        telefoneRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
