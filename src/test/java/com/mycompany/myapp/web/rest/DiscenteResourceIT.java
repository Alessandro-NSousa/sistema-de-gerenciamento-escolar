package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Discente;
import com.mycompany.myapp.domain.enumeration.Sexo;
import com.mycompany.myapp.repository.DiscenteRepository;
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
 * Integration tests for the {@link DiscenteResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class DiscenteResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_CPF = "AAAAAAAAAA";
    private static final String UPDATED_CPF = "BBBBBBBBBB";

    private static final Integer DEFAULT_MATRICULA = 1;
    private static final Integer UPDATED_MATRICULA = 2;

    private static final String DEFAULT_CURSO = "AAAAAAAAAA";
    private static final String UPDATED_CURSO = "BBBBBBBBBB";

    private static final Sexo DEFAULT_GENERO = Sexo.F;
    private static final Sexo UPDATED_GENERO = Sexo.M;

    private static final String ENTITY_API_URL = "/api/discentes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DiscenteRepository discenteRepository;

    @Mock
    private DiscenteRepository discenteRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDiscenteMockMvc;

    private Discente discente;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Discente createEntity(EntityManager em) {
        Discente discente = new Discente()
            .nome(DEFAULT_NOME)
            .cpf(DEFAULT_CPF)
            .matricula(DEFAULT_MATRICULA)
            .curso(DEFAULT_CURSO)
            .genero(DEFAULT_GENERO);
        return discente;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Discente createUpdatedEntity(EntityManager em) {
        Discente discente = new Discente()
            .nome(UPDATED_NOME)
            .cpf(UPDATED_CPF)
            .matricula(UPDATED_MATRICULA)
            .curso(UPDATED_CURSO)
            .genero(UPDATED_GENERO);
        return discente;
    }

    @BeforeEach
    public void initTest() {
        discente = createEntity(em);
    }

    @Test
    @Transactional
    void createDiscente() throws Exception {
        int databaseSizeBeforeCreate = discenteRepository.findAll().size();
        // Create the Discente
        restDiscenteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(discente)))
            .andExpect(status().isCreated());

        // Validate the Discente in the database
        List<Discente> discenteList = discenteRepository.findAll();
        assertThat(discenteList).hasSize(databaseSizeBeforeCreate + 1);
        Discente testDiscente = discenteList.get(discenteList.size() - 1);
        assertThat(testDiscente.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testDiscente.getCpf()).isEqualTo(DEFAULT_CPF);
        assertThat(testDiscente.getMatricula()).isEqualTo(DEFAULT_MATRICULA);
        assertThat(testDiscente.getCurso()).isEqualTo(DEFAULT_CURSO);
        assertThat(testDiscente.getGenero()).isEqualTo(DEFAULT_GENERO);
    }

    @Test
    @Transactional
    void createDiscenteWithExistingId() throws Exception {
        // Create the Discente with an existing ID
        discente.setId(1L);

        int databaseSizeBeforeCreate = discenteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDiscenteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(discente)))
            .andExpect(status().isBadRequest());

        // Validate the Discente in the database
        List<Discente> discenteList = discenteRepository.findAll();
        assertThat(discenteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = discenteRepository.findAll().size();
        // set the field null
        discente.setNome(null);

        // Create the Discente, which fails.

        restDiscenteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(discente)))
            .andExpect(status().isBadRequest());

        List<Discente> discenteList = discenteRepository.findAll();
        assertThat(discenteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCpfIsRequired() throws Exception {
        int databaseSizeBeforeTest = discenteRepository.findAll().size();
        // set the field null
        discente.setCpf(null);

        // Create the Discente, which fails.

        restDiscenteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(discente)))
            .andExpect(status().isBadRequest());

        List<Discente> discenteList = discenteRepository.findAll();
        assertThat(discenteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkMatriculaIsRequired() throws Exception {
        int databaseSizeBeforeTest = discenteRepository.findAll().size();
        // set the field null
        discente.setMatricula(null);

        // Create the Discente, which fails.

        restDiscenteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(discente)))
            .andExpect(status().isBadRequest());

        List<Discente> discenteList = discenteRepository.findAll();
        assertThat(discenteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCursoIsRequired() throws Exception {
        int databaseSizeBeforeTest = discenteRepository.findAll().size();
        // set the field null
        discente.setCurso(null);

        // Create the Discente, which fails.

        restDiscenteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(discente)))
            .andExpect(status().isBadRequest());

        List<Discente> discenteList = discenteRepository.findAll();
        assertThat(discenteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDiscentes() throws Exception {
        // Initialize the database
        discenteRepository.saveAndFlush(discente);

        // Get all the discenteList
        restDiscenteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(discente.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].cpf").value(hasItem(DEFAULT_CPF)))
            .andExpect(jsonPath("$.[*].matricula").value(hasItem(DEFAULT_MATRICULA)))
            .andExpect(jsonPath("$.[*].curso").value(hasItem(DEFAULT_CURSO)))
            .andExpect(jsonPath("$.[*].genero").value(hasItem(DEFAULT_GENERO.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDiscentesWithEagerRelationshipsIsEnabled() throws Exception {
        when(discenteRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDiscenteMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(discenteRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDiscentesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(discenteRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDiscenteMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(discenteRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getDiscente() throws Exception {
        // Initialize the database
        discenteRepository.saveAndFlush(discente);

        // Get the discente
        restDiscenteMockMvc
            .perform(get(ENTITY_API_URL_ID, discente.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(discente.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.cpf").value(DEFAULT_CPF))
            .andExpect(jsonPath("$.matricula").value(DEFAULT_MATRICULA))
            .andExpect(jsonPath("$.curso").value(DEFAULT_CURSO))
            .andExpect(jsonPath("$.genero").value(DEFAULT_GENERO.toString()));
    }

    @Test
    @Transactional
    void getNonExistingDiscente() throws Exception {
        // Get the discente
        restDiscenteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDiscente() throws Exception {
        // Initialize the database
        discenteRepository.saveAndFlush(discente);

        int databaseSizeBeforeUpdate = discenteRepository.findAll().size();

        // Update the discente
        Discente updatedDiscente = discenteRepository.findById(discente.getId()).get();
        // Disconnect from session so that the updates on updatedDiscente are not directly saved in db
        em.detach(updatedDiscente);
        updatedDiscente.nome(UPDATED_NOME).cpf(UPDATED_CPF).matricula(UPDATED_MATRICULA).curso(UPDATED_CURSO).genero(UPDATED_GENERO);

        restDiscenteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDiscente.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDiscente))
            )
            .andExpect(status().isOk());

        // Validate the Discente in the database
        List<Discente> discenteList = discenteRepository.findAll();
        assertThat(discenteList).hasSize(databaseSizeBeforeUpdate);
        Discente testDiscente = discenteList.get(discenteList.size() - 1);
        assertThat(testDiscente.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testDiscente.getCpf()).isEqualTo(UPDATED_CPF);
        assertThat(testDiscente.getMatricula()).isEqualTo(UPDATED_MATRICULA);
        assertThat(testDiscente.getCurso()).isEqualTo(UPDATED_CURSO);
        assertThat(testDiscente.getGenero()).isEqualTo(UPDATED_GENERO);
    }

    @Test
    @Transactional
    void putNonExistingDiscente() throws Exception {
        int databaseSizeBeforeUpdate = discenteRepository.findAll().size();
        discente.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDiscenteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, discente.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(discente))
            )
            .andExpect(status().isBadRequest());

        // Validate the Discente in the database
        List<Discente> discenteList = discenteRepository.findAll();
        assertThat(discenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDiscente() throws Exception {
        int databaseSizeBeforeUpdate = discenteRepository.findAll().size();
        discente.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiscenteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(discente))
            )
            .andExpect(status().isBadRequest());

        // Validate the Discente in the database
        List<Discente> discenteList = discenteRepository.findAll();
        assertThat(discenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDiscente() throws Exception {
        int databaseSizeBeforeUpdate = discenteRepository.findAll().size();
        discente.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiscenteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(discente)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Discente in the database
        List<Discente> discenteList = discenteRepository.findAll();
        assertThat(discenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDiscenteWithPatch() throws Exception {
        // Initialize the database
        discenteRepository.saveAndFlush(discente);

        int databaseSizeBeforeUpdate = discenteRepository.findAll().size();

        // Update the discente using partial update
        Discente partialUpdatedDiscente = new Discente();
        partialUpdatedDiscente.setId(discente.getId());

        partialUpdatedDiscente.nome(UPDATED_NOME).curso(UPDATED_CURSO).genero(UPDATED_GENERO);

        restDiscenteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDiscente.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDiscente))
            )
            .andExpect(status().isOk());

        // Validate the Discente in the database
        List<Discente> discenteList = discenteRepository.findAll();
        assertThat(discenteList).hasSize(databaseSizeBeforeUpdate);
        Discente testDiscente = discenteList.get(discenteList.size() - 1);
        assertThat(testDiscente.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testDiscente.getCpf()).isEqualTo(DEFAULT_CPF);
        assertThat(testDiscente.getMatricula()).isEqualTo(DEFAULT_MATRICULA);
        assertThat(testDiscente.getCurso()).isEqualTo(UPDATED_CURSO);
        assertThat(testDiscente.getGenero()).isEqualTo(UPDATED_GENERO);
    }

    @Test
    @Transactional
    void fullUpdateDiscenteWithPatch() throws Exception {
        // Initialize the database
        discenteRepository.saveAndFlush(discente);

        int databaseSizeBeforeUpdate = discenteRepository.findAll().size();

        // Update the discente using partial update
        Discente partialUpdatedDiscente = new Discente();
        partialUpdatedDiscente.setId(discente.getId());

        partialUpdatedDiscente.nome(UPDATED_NOME).cpf(UPDATED_CPF).matricula(UPDATED_MATRICULA).curso(UPDATED_CURSO).genero(UPDATED_GENERO);

        restDiscenteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDiscente.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDiscente))
            )
            .andExpect(status().isOk());

        // Validate the Discente in the database
        List<Discente> discenteList = discenteRepository.findAll();
        assertThat(discenteList).hasSize(databaseSizeBeforeUpdate);
        Discente testDiscente = discenteList.get(discenteList.size() - 1);
        assertThat(testDiscente.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testDiscente.getCpf()).isEqualTo(UPDATED_CPF);
        assertThat(testDiscente.getMatricula()).isEqualTo(UPDATED_MATRICULA);
        assertThat(testDiscente.getCurso()).isEqualTo(UPDATED_CURSO);
        assertThat(testDiscente.getGenero()).isEqualTo(UPDATED_GENERO);
    }

    @Test
    @Transactional
    void patchNonExistingDiscente() throws Exception {
        int databaseSizeBeforeUpdate = discenteRepository.findAll().size();
        discente.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDiscenteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, discente.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(discente))
            )
            .andExpect(status().isBadRequest());

        // Validate the Discente in the database
        List<Discente> discenteList = discenteRepository.findAll();
        assertThat(discenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDiscente() throws Exception {
        int databaseSizeBeforeUpdate = discenteRepository.findAll().size();
        discente.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiscenteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(discente))
            )
            .andExpect(status().isBadRequest());

        // Validate the Discente in the database
        List<Discente> discenteList = discenteRepository.findAll();
        assertThat(discenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDiscente() throws Exception {
        int databaseSizeBeforeUpdate = discenteRepository.findAll().size();
        discente.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiscenteMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(discente)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Discente in the database
        List<Discente> discenteList = discenteRepository.findAll();
        assertThat(discenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDiscente() throws Exception {
        // Initialize the database
        discenteRepository.saveAndFlush(discente);

        int databaseSizeBeforeDelete = discenteRepository.findAll().size();

        // Delete the discente
        restDiscenteMockMvc
            .perform(delete(ENTITY_API_URL_ID, discente.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Discente> discenteList = discenteRepository.findAll();
        assertThat(discenteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
