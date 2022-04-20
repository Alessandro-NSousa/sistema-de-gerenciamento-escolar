package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Matricula;
import com.mycompany.myapp.repository.MatriculaRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MatriculaResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class MatriculaResourceIT {

    private static final LocalDate DEFAULT_ANO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_ANO = LocalDate.now(ZoneId.systemDefault());

    private static final Double DEFAULT_NOTA_FINAL = 1D;
    private static final Double UPDATED_NOTA_FINAL = 2D;

    private static final Integer DEFAULT_N_FALTAS = 1;
    private static final Integer UPDATED_N_FALTAS = 2;

    private static final String ENTITY_API_URL = "/api/matriculas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MatriculaRepository matriculaRepository;

    @Mock
    private MatriculaRepository matriculaRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMatriculaMockMvc;

    private Matricula matricula;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Matricula createEntity(EntityManager em) {
        Matricula matricula = new Matricula().ano(DEFAULT_ANO).notaFinal(DEFAULT_NOTA_FINAL).nFaltas(DEFAULT_N_FALTAS);
        return matricula;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Matricula createUpdatedEntity(EntityManager em) {
        Matricula matricula = new Matricula().ano(UPDATED_ANO).notaFinal(UPDATED_NOTA_FINAL).nFaltas(UPDATED_N_FALTAS);
        return matricula;
    }

    @BeforeEach
    public void initTest() {
        matricula = createEntity(em);
    }

    @Test
    @Transactional
    void createMatricula() throws Exception {
        int databaseSizeBeforeCreate = matriculaRepository.findAll().size();
        // Create the Matricula
        restMatriculaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(matricula)))
            .andExpect(status().isCreated());

        // Validate the Matricula in the database
        List<Matricula> matriculaList = matriculaRepository.findAll();
        assertThat(matriculaList).hasSize(databaseSizeBeforeCreate + 1);
        Matricula testMatricula = matriculaList.get(matriculaList.size() - 1);
        assertThat(testMatricula.getAno()).isEqualTo(DEFAULT_ANO);
        assertThat(testMatricula.getNotaFinal()).isEqualTo(DEFAULT_NOTA_FINAL);
        assertThat(testMatricula.getnFaltas()).isEqualTo(DEFAULT_N_FALTAS);
    }

    @Test
    @Transactional
    void createMatriculaWithExistingId() throws Exception {
        // Create the Matricula with an existing ID
        matricula.setId(1L);

        int databaseSizeBeforeCreate = matriculaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMatriculaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(matricula)))
            .andExpect(status().isBadRequest());

        // Validate the Matricula in the database
        List<Matricula> matriculaList = matriculaRepository.findAll();
        assertThat(matriculaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMatriculas() throws Exception {
        // Initialize the database
        matriculaRepository.saveAndFlush(matricula);

        // Get all the matriculaList
        restMatriculaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(matricula.getId().intValue())))
            .andExpect(jsonPath("$.[*].ano").value(hasItem(DEFAULT_ANO.toString())))
            .andExpect(jsonPath("$.[*].notaFinal").value(hasItem(DEFAULT_NOTA_FINAL.doubleValue())))
            .andExpect(jsonPath("$.[*].nFaltas").value(hasItem(DEFAULT_N_FALTAS)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMatriculasWithEagerRelationshipsIsEnabled() throws Exception {
        when(matriculaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMatriculaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(matriculaRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMatriculasWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(matriculaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMatriculaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(matriculaRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getMatricula() throws Exception {
        // Initialize the database
        matriculaRepository.saveAndFlush(matricula);

        // Get the matricula
        restMatriculaMockMvc
            .perform(get(ENTITY_API_URL_ID, matricula.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(matricula.getId().intValue()))
            .andExpect(jsonPath("$.ano").value(DEFAULT_ANO.toString()))
            .andExpect(jsonPath("$.notaFinal").value(DEFAULT_NOTA_FINAL.doubleValue()))
            .andExpect(jsonPath("$.nFaltas").value(DEFAULT_N_FALTAS));
    }

    @Test
    @Transactional
    void getNonExistingMatricula() throws Exception {
        // Get the matricula
        restMatriculaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewMatricula() throws Exception {
        // Initialize the database
        matriculaRepository.saveAndFlush(matricula);

        int databaseSizeBeforeUpdate = matriculaRepository.findAll().size();

        // Update the matricula
        Matricula updatedMatricula = matriculaRepository.findById(matricula.getId()).get();
        // Disconnect from session so that the updates on updatedMatricula are not directly saved in db
        em.detach(updatedMatricula);
        updatedMatricula.ano(UPDATED_ANO).notaFinal(UPDATED_NOTA_FINAL).nFaltas(UPDATED_N_FALTAS);

        restMatriculaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMatricula.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMatricula))
            )
            .andExpect(status().isOk());

        // Validate the Matricula in the database
        List<Matricula> matriculaList = matriculaRepository.findAll();
        assertThat(matriculaList).hasSize(databaseSizeBeforeUpdate);
        Matricula testMatricula = matriculaList.get(matriculaList.size() - 1);
        assertThat(testMatricula.getAno()).isEqualTo(UPDATED_ANO);
        assertThat(testMatricula.getNotaFinal()).isEqualTo(UPDATED_NOTA_FINAL);
        assertThat(testMatricula.getnFaltas()).isEqualTo(UPDATED_N_FALTAS);
    }

    @Test
    @Transactional
    void putNonExistingMatricula() throws Exception {
        int databaseSizeBeforeUpdate = matriculaRepository.findAll().size();
        matricula.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMatriculaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, matricula.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(matricula))
            )
            .andExpect(status().isBadRequest());

        // Validate the Matricula in the database
        List<Matricula> matriculaList = matriculaRepository.findAll();
        assertThat(matriculaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMatricula() throws Exception {
        int databaseSizeBeforeUpdate = matriculaRepository.findAll().size();
        matricula.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMatriculaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(matricula))
            )
            .andExpect(status().isBadRequest());

        // Validate the Matricula in the database
        List<Matricula> matriculaList = matriculaRepository.findAll();
        assertThat(matriculaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMatricula() throws Exception {
        int databaseSizeBeforeUpdate = matriculaRepository.findAll().size();
        matricula.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMatriculaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(matricula)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Matricula in the database
        List<Matricula> matriculaList = matriculaRepository.findAll();
        assertThat(matriculaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMatriculaWithPatch() throws Exception {
        // Initialize the database
        matriculaRepository.saveAndFlush(matricula);

        int databaseSizeBeforeUpdate = matriculaRepository.findAll().size();

        // Update the matricula using partial update
        Matricula partialUpdatedMatricula = new Matricula();
        partialUpdatedMatricula.setId(matricula.getId());

        partialUpdatedMatricula.notaFinal(UPDATED_NOTA_FINAL);

        restMatriculaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMatricula.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMatricula))
            )
            .andExpect(status().isOk());

        // Validate the Matricula in the database
        List<Matricula> matriculaList = matriculaRepository.findAll();
        assertThat(matriculaList).hasSize(databaseSizeBeforeUpdate);
        Matricula testMatricula = matriculaList.get(matriculaList.size() - 1);
        assertThat(testMatricula.getAno()).isEqualTo(DEFAULT_ANO);
        assertThat(testMatricula.getNotaFinal()).isEqualTo(UPDATED_NOTA_FINAL);
        assertThat(testMatricula.getnFaltas()).isEqualTo(DEFAULT_N_FALTAS);
    }

    @Test
    @Transactional
    void fullUpdateMatriculaWithPatch() throws Exception {
        // Initialize the database
        matriculaRepository.saveAndFlush(matricula);

        int databaseSizeBeforeUpdate = matriculaRepository.findAll().size();

        // Update the matricula using partial update
        Matricula partialUpdatedMatricula = new Matricula();
        partialUpdatedMatricula.setId(matricula.getId());

        partialUpdatedMatricula.ano(UPDATED_ANO).notaFinal(UPDATED_NOTA_FINAL).nFaltas(UPDATED_N_FALTAS);

        restMatriculaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMatricula.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMatricula))
            )
            .andExpect(status().isOk());

        // Validate the Matricula in the database
        List<Matricula> matriculaList = matriculaRepository.findAll();
        assertThat(matriculaList).hasSize(databaseSizeBeforeUpdate);
        Matricula testMatricula = matriculaList.get(matriculaList.size() - 1);
        assertThat(testMatricula.getAno()).isEqualTo(UPDATED_ANO);
        assertThat(testMatricula.getNotaFinal()).isEqualTo(UPDATED_NOTA_FINAL);
        assertThat(testMatricula.getnFaltas()).isEqualTo(UPDATED_N_FALTAS);
    }

    @Test
    @Transactional
    void patchNonExistingMatricula() throws Exception {
        int databaseSizeBeforeUpdate = matriculaRepository.findAll().size();
        matricula.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMatriculaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, matricula.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(matricula))
            )
            .andExpect(status().isBadRequest());

        // Validate the Matricula in the database
        List<Matricula> matriculaList = matriculaRepository.findAll();
        assertThat(matriculaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMatricula() throws Exception {
        int databaseSizeBeforeUpdate = matriculaRepository.findAll().size();
        matricula.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMatriculaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(matricula))
            )
            .andExpect(status().isBadRequest());

        // Validate the Matricula in the database
        List<Matricula> matriculaList = matriculaRepository.findAll();
        assertThat(matriculaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMatricula() throws Exception {
        int databaseSizeBeforeUpdate = matriculaRepository.findAll().size();
        matricula.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMatriculaMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(matricula))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Matricula in the database
        List<Matricula> matriculaList = matriculaRepository.findAll();
        assertThat(matriculaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMatricula() throws Exception {
        // Initialize the database
        matriculaRepository.saveAndFlush(matricula);

        int databaseSizeBeforeDelete = matriculaRepository.findAll().size();

        // Delete the matricula
        restMatriculaMockMvc
            .perform(delete(ENTITY_API_URL_ID, matricula.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Matricula> matriculaList = matriculaRepository.findAll();
        assertThat(matriculaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
