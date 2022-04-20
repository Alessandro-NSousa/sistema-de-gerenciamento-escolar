package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Ministrada;
import com.mycompany.myapp.repository.MinistradaRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Ministrada}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MinistradaResource {

    private final Logger log = LoggerFactory.getLogger(MinistradaResource.class);

    private static final String ENTITY_NAME = "ministrada";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MinistradaRepository ministradaRepository;

    public MinistradaResource(MinistradaRepository ministradaRepository) {
        this.ministradaRepository = ministradaRepository;
    }

    /**
     * {@code POST  /ministradas} : Create a new ministrada.
     *
     * @param ministrada the ministrada to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ministrada, or with status {@code 400 (Bad Request)} if the ministrada has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ministradas")
    public ResponseEntity<Ministrada> createMinistrada(@RequestBody Ministrada ministrada) throws URISyntaxException {
        log.debug("REST request to save Ministrada : {}", ministrada);
        if (ministrada.getId() != null) {
            throw new BadRequestAlertException("A new ministrada cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Ministrada result = ministradaRepository.save(ministrada);
        return ResponseEntity
            .created(new URI("/api/ministradas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ministradas/:id} : Updates an existing ministrada.
     *
     * @param id the id of the ministrada to save.
     * @param ministrada the ministrada to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ministrada,
     * or with status {@code 400 (Bad Request)} if the ministrada is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ministrada couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ministradas/{id}")
    public ResponseEntity<Ministrada> updateMinistrada(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Ministrada ministrada
    ) throws URISyntaxException {
        log.debug("REST request to update Ministrada : {}, {}", id, ministrada);
        if (ministrada.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ministrada.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ministradaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Ministrada result = ministradaRepository.save(ministrada);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ministrada.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ministradas/:id} : Partial updates given fields of an existing ministrada, field will ignore if it is null
     *
     * @param id the id of the ministrada to save.
     * @param ministrada the ministrada to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ministrada,
     * or with status {@code 400 (Bad Request)} if the ministrada is not valid,
     * or with status {@code 404 (Not Found)} if the ministrada is not found,
     * or with status {@code 500 (Internal Server Error)} if the ministrada couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/ministradas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Ministrada> partialUpdateMinistrada(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Ministrada ministrada
    ) throws URISyntaxException {
        log.debug("REST request to partial update Ministrada partially : {}, {}", id, ministrada);
        if (ministrada.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ministrada.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ministradaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Ministrada> result = ministradaRepository
            .findById(ministrada.getId())
            .map(existingMinistrada -> {
                if (ministrada.getAno() != null) {
                    existingMinistrada.setAno(ministrada.getAno());
                }
                if (ministrada.getCh() != null) {
                    existingMinistrada.setCh(ministrada.getCh());
                }

                return existingMinistrada;
            })
            .map(ministradaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ministrada.getId().toString())
        );
    }

    /**
     * {@code GET  /ministradas} : get all the ministradas.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ministradas in body.
     */
    @GetMapping("/ministradas")
    public List<Ministrada> getAllMinistradas(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Ministradas");
        return ministradaRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /ministradas/:id} : get the "id" ministrada.
     *
     * @param id the id of the ministrada to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ministrada, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ministradas/{id}")
    public ResponseEntity<Ministrada> getMinistrada(@PathVariable Long id) {
        log.debug("REST request to get Ministrada : {}", id);
        Optional<Ministrada> ministrada = ministradaRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(ministrada);
    }

    /**
     * {@code DELETE  /ministradas/:id} : delete the "id" ministrada.
     *
     * @param id the id of the ministrada to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ministradas/{id}")
    public ResponseEntity<Void> deleteMinistrada(@PathVariable Long id) {
        log.debug("REST request to delete Ministrada : {}", id);
        ministradaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
