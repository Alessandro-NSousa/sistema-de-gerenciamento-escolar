package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Disciplina;
import com.mycompany.myapp.repository.DisciplinaRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link DisciplinaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DisciplinaResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATA_INICIO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA_INICIO = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_CARGA_HORARIA = 1;
    private static final Integer UPDATED_CARGA_HORARIA = 2;

    private static final Integer DEFAULT_CREDITO = 1;
    private static final Integer UPDATED_CREDITO = 2;

    private static final String ENTITY_API_URL = "/api/disciplinas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDisciplinaMockMvc;

    private Disciplina disciplina;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Disciplina createEntity(EntityManager em) {
        Disciplina disciplina = new Disciplina()
            .nome(DEFAULT_NOME)
            .dataInicio(DEFAULT_DATA_INICIO)
            .cargaHoraria(DEFAULT_CARGA_HORARIA)
            .credito(DEFAULT_CREDITO);
        return disciplina;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Disciplina createUpdatedEntity(EntityManager em) {
        Disciplina disciplina = new Disciplina()
            .nome(UPDATED_NOME)
            .dataInicio(UPDATED_DATA_INICIO)
            .cargaHoraria(UPDATED_CARGA_HORARIA)
            .credito(UPDATED_CREDITO);
        return disciplina;
    }

    @BeforeEach
    public void initTest() {
        disciplina = createEntity(em);
    }

    @Test
    @Transactional
    void createDisciplina() throws Exception {
        int databaseSizeBeforeCreate = disciplinaRepository.findAll().size();
        // Create the Disciplina
        restDisciplinaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(disciplina)))
            .andExpect(status().isCreated());

        // Validate the Disciplina in the database
        List<Disciplina> disciplinaList = disciplinaRepository.findAll();
        assertThat(disciplinaList).hasSize(databaseSizeBeforeCreate + 1);
        Disciplina testDisciplina = disciplinaList.get(disciplinaList.size() - 1);
        assertThat(testDisciplina.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testDisciplina.getDataInicio()).isEqualTo(DEFAULT_DATA_INICIO);
        assertThat(testDisciplina.getCargaHoraria()).isEqualTo(DEFAULT_CARGA_HORARIA);
        assertThat(testDisciplina.getCredito()).isEqualTo(DEFAULT_CREDITO);
    }

    @Test
    @Transactional
    void createDisciplinaWithExistingId() throws Exception {
        // Create the Disciplina with an existing ID
        disciplina.setId(1L);

        int databaseSizeBeforeCreate = disciplinaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDisciplinaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(disciplina)))
            .andExpect(status().isBadRequest());

        // Validate the Disciplina in the database
        List<Disciplina> disciplinaList = disciplinaRepository.findAll();
        assertThat(disciplinaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = disciplinaRepository.findAll().size();
        // set the field null
        disciplina.setNome(null);

        // Create the Disciplina, which fails.

        restDisciplinaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(disciplina)))
            .andExpect(status().isBadRequest());

        List<Disciplina> disciplinaList = disciplinaRepository.findAll();
        assertThat(disciplinaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDataInicioIsRequired() throws Exception {
        int databaseSizeBeforeTest = disciplinaRepository.findAll().size();
        // set the field null
        disciplina.setDataInicio(null);

        // Create the Disciplina, which fails.

        restDisciplinaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(disciplina)))
            .andExpect(status().isBadRequest());

        List<Disciplina> disciplinaList = disciplinaRepository.findAll();
        assertThat(disciplinaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCargaHorariaIsRequired() throws Exception {
        int databaseSizeBeforeTest = disciplinaRepository.findAll().size();
        // set the field null
        disciplina.setCargaHoraria(null);

        // Create the Disciplina, which fails.

        restDisciplinaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(disciplina)))
            .andExpect(status().isBadRequest());

        List<Disciplina> disciplinaList = disciplinaRepository.findAll();
        assertThat(disciplinaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDisciplinas() throws Exception {
        // Initialize the database
        disciplinaRepository.saveAndFlush(disciplina);

        // Get all the disciplinaList
        restDisciplinaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(disciplina.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].dataInicio").value(hasItem(DEFAULT_DATA_INICIO.toString())))
            .andExpect(jsonPath("$.[*].cargaHoraria").value(hasItem(DEFAULT_CARGA_HORARIA)))
            .andExpect(jsonPath("$.[*].credito").value(hasItem(DEFAULT_CREDITO)));
    }

    @Test
    @Transactional
    void getDisciplina() throws Exception {
        // Initialize the database
        disciplinaRepository.saveAndFlush(disciplina);

        // Get the disciplina
        restDisciplinaMockMvc
            .perform(get(ENTITY_API_URL_ID, disciplina.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(disciplina.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.dataInicio").value(DEFAULT_DATA_INICIO.toString()))
            .andExpect(jsonPath("$.cargaHoraria").value(DEFAULT_CARGA_HORARIA))
            .andExpect(jsonPath("$.credito").value(DEFAULT_CREDITO));
    }

    @Test
    @Transactional
    void getNonExistingDisciplina() throws Exception {
        // Get the disciplina
        restDisciplinaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDisciplina() throws Exception {
        // Initialize the database
        disciplinaRepository.saveAndFlush(disciplina);

        int databaseSizeBeforeUpdate = disciplinaRepository.findAll().size();

        // Update the disciplina
        Disciplina updatedDisciplina = disciplinaRepository.findById(disciplina.getId()).get();
        // Disconnect from session so that the updates on updatedDisciplina are not directly saved in db
        em.detach(updatedDisciplina);
        updatedDisciplina.nome(UPDATED_NOME).dataInicio(UPDATED_DATA_INICIO).cargaHoraria(UPDATED_CARGA_HORARIA).credito(UPDATED_CREDITO);

        restDisciplinaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDisciplina.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDisciplina))
            )
            .andExpect(status().isOk());

        // Validate the Disciplina in the database
        List<Disciplina> disciplinaList = disciplinaRepository.findAll();
        assertThat(disciplinaList).hasSize(databaseSizeBeforeUpdate);
        Disciplina testDisciplina = disciplinaList.get(disciplinaList.size() - 1);
        assertThat(testDisciplina.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testDisciplina.getDataInicio()).isEqualTo(UPDATED_DATA_INICIO);
        assertThat(testDisciplina.getCargaHoraria()).isEqualTo(UPDATED_CARGA_HORARIA);
        assertThat(testDisciplina.getCredito()).isEqualTo(UPDATED_CREDITO);
    }

    @Test
    @Transactional
    void putNonExistingDisciplina() throws Exception {
        int databaseSizeBeforeUpdate = disciplinaRepository.findAll().size();
        disciplina.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDisciplinaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, disciplina.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(disciplina))
            )
            .andExpect(status().isBadRequest());

        // Validate the Disciplina in the database
        List<Disciplina> disciplinaList = disciplinaRepository.findAll();
        assertThat(disciplinaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDisciplina() throws Exception {
        int databaseSizeBeforeUpdate = disciplinaRepository.findAll().size();
        disciplina.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDisciplinaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(disciplina))
            )
            .andExpect(status().isBadRequest());

        // Validate the Disciplina in the database
        List<Disciplina> disciplinaList = disciplinaRepository.findAll();
        assertThat(disciplinaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDisciplina() throws Exception {
        int databaseSizeBeforeUpdate = disciplinaRepository.findAll().size();
        disciplina.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDisciplinaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(disciplina)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Disciplina in the database
        List<Disciplina> disciplinaList = disciplinaRepository.findAll();
        assertThat(disciplinaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDisciplinaWithPatch() throws Exception {
        // Initialize the database
        disciplinaRepository.saveAndFlush(disciplina);

        int databaseSizeBeforeUpdate = disciplinaRepository.findAll().size();

        // Update the disciplina using partial update
        Disciplina partialUpdatedDisciplina = new Disciplina();
        partialUpdatedDisciplina.setId(disciplina.getId());

        partialUpdatedDisciplina.nome(UPDATED_NOME).dataInicio(UPDATED_DATA_INICIO).cargaHoraria(UPDATED_CARGA_HORARIA);

        restDisciplinaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDisciplina.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDisciplina))
            )
            .andExpect(status().isOk());

        // Validate the Disciplina in the database
        List<Disciplina> disciplinaList = disciplinaRepository.findAll();
        assertThat(disciplinaList).hasSize(databaseSizeBeforeUpdate);
        Disciplina testDisciplina = disciplinaList.get(disciplinaList.size() - 1);
        assertThat(testDisciplina.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testDisciplina.getDataInicio()).isEqualTo(UPDATED_DATA_INICIO);
        assertThat(testDisciplina.getCargaHoraria()).isEqualTo(UPDATED_CARGA_HORARIA);
        assertThat(testDisciplina.getCredito()).isEqualTo(DEFAULT_CREDITO);
    }

    @Test
    @Transactional
    void fullUpdateDisciplinaWithPatch() throws Exception {
        // Initialize the database
        disciplinaRepository.saveAndFlush(disciplina);

        int databaseSizeBeforeUpdate = disciplinaRepository.findAll().size();

        // Update the disciplina using partial update
        Disciplina partialUpdatedDisciplina = new Disciplina();
        partialUpdatedDisciplina.setId(disciplina.getId());

        partialUpdatedDisciplina
            .nome(UPDATED_NOME)
            .dataInicio(UPDATED_DATA_INICIO)
            .cargaHoraria(UPDATED_CARGA_HORARIA)
            .credito(UPDATED_CREDITO);

        restDisciplinaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDisciplina.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDisciplina))
            )
            .andExpect(status().isOk());

        // Validate the Disciplina in the database
        List<Disciplina> disciplinaList = disciplinaRepository.findAll();
        assertThat(disciplinaList).hasSize(databaseSizeBeforeUpdate);
        Disciplina testDisciplina = disciplinaList.get(disciplinaList.size() - 1);
        assertThat(testDisciplina.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testDisciplina.getDataInicio()).isEqualTo(UPDATED_DATA_INICIO);
        assertThat(testDisciplina.getCargaHoraria()).isEqualTo(UPDATED_CARGA_HORARIA);
        assertThat(testDisciplina.getCredito()).isEqualTo(UPDATED_CREDITO);
    }

    @Test
    @Transactional
    void patchNonExistingDisciplina() throws Exception {
        int databaseSizeBeforeUpdate = disciplinaRepository.findAll().size();
        disciplina.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDisciplinaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, disciplina.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(disciplina))
            )
            .andExpect(status().isBadRequest());

        // Validate the Disciplina in the database
        List<Disciplina> disciplinaList = disciplinaRepository.findAll();
        assertThat(disciplinaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDisciplina() throws Exception {
        int databaseSizeBeforeUpdate = disciplinaRepository.findAll().size();
        disciplina.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDisciplinaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(disciplina))
            )
            .andExpect(status().isBadRequest());

        // Validate the Disciplina in the database
        List<Disciplina> disciplinaList = disciplinaRepository.findAll();
        assertThat(disciplinaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDisciplina() throws Exception {
        int databaseSizeBeforeUpdate = disciplinaRepository.findAll().size();
        disciplina.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDisciplinaMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(disciplina))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Disciplina in the database
        List<Disciplina> disciplinaList = disciplinaRepository.findAll();
        assertThat(disciplinaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDisciplina() throws Exception {
        // Initialize the database
        disciplinaRepository.saveAndFlush(disciplina);

        int databaseSizeBeforeDelete = disciplinaRepository.findAll().size();

        // Delete the disciplina
        restDisciplinaMockMvc
            .perform(delete(ENTITY_API_URL_ID, disciplina.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Disciplina> disciplinaList = disciplinaRepository.findAll();
        assertThat(disciplinaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
