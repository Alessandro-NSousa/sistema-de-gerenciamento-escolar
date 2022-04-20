package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Ministrada;
import com.mycompany.myapp.repository.MinistradaRepository;
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
 * Integration tests for the {@link MinistradaResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class MinistradaResourceIT {

    private static final LocalDate DEFAULT_ANO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_ANO = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_CH = 1;
    private static final Integer UPDATED_CH = 2;

    private static final String ENTITY_API_URL = "/api/ministradas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MinistradaRepository ministradaRepository;

    @Mock
    private MinistradaRepository ministradaRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMinistradaMockMvc;

    private Ministrada ministrada;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ministrada createEntity(EntityManager em) {
        Ministrada ministrada = new Ministrada().ano(DEFAULT_ANO).ch(DEFAULT_CH);
        return ministrada;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ministrada createUpdatedEntity(EntityManager em) {
        Ministrada ministrada = new Ministrada().ano(UPDATED_ANO).ch(UPDATED_CH);
        return ministrada;
    }

    @BeforeEach
    public void initTest() {
        ministrada = createEntity(em);
    }

    @Test
    @Transactional
    void createMinistrada() throws Exception {
        int databaseSizeBeforeCreate = ministradaRepository.findAll().size();
        // Create the Ministrada
        restMinistradaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ministrada)))
            .andExpect(status().isCreated());

        // Validate the Ministrada in the database
        List<Ministrada> ministradaList = ministradaRepository.findAll();
        assertThat(ministradaList).hasSize(databaseSizeBeforeCreate + 1);
        Ministrada testMinistrada = ministradaList.get(ministradaList.size() - 1);
        assertThat(testMinistrada.getAno()).isEqualTo(DEFAULT_ANO);
        assertThat(testMinistrada.getCh()).isEqualTo(DEFAULT_CH);
    }

    @Test
    @Transactional
    void createMinistradaWithExistingId() throws Exception {
        // Create the Ministrada with an existing ID
        ministrada.setId(1L);

        int databaseSizeBeforeCreate = ministradaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMinistradaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ministrada)))
            .andExpect(status().isBadRequest());

        // Validate the Ministrada in the database
        List<Ministrada> ministradaList = ministradaRepository.findAll();
        assertThat(ministradaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMinistradas() throws Exception {
        // Initialize the database
        ministradaRepository.saveAndFlush(ministrada);

        // Get all the ministradaList
        restMinistradaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ministrada.getId().intValue())))
            .andExpect(jsonPath("$.[*].ano").value(hasItem(DEFAULT_ANO.toString())))
            .andExpect(jsonPath("$.[*].ch").value(hasItem(DEFAULT_CH)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMinistradasWithEagerRelationshipsIsEnabled() throws Exception {
        when(ministradaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMinistradaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(ministradaRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMinistradasWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(ministradaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMinistradaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(ministradaRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getMinistrada() throws Exception {
        // Initialize the database
        ministradaRepository.saveAndFlush(ministrada);

        // Get the ministrada
        restMinistradaMockMvc
            .perform(get(ENTITY_API_URL_ID, ministrada.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ministrada.getId().intValue()))
            .andExpect(jsonPath("$.ano").value(DEFAULT_ANO.toString()))
            .andExpect(jsonPath("$.ch").value(DEFAULT_CH));
    }

    @Test
    @Transactional
    void getNonExistingMinistrada() throws Exception {
        // Get the ministrada
        restMinistradaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewMinistrada() throws Exception {
        // Initialize the database
        ministradaRepository.saveAndFlush(ministrada);

        int databaseSizeBeforeUpdate = ministradaRepository.findAll().size();

        // Update the ministrada
        Ministrada updatedMinistrada = ministradaRepository.findById(ministrada.getId()).get();
        // Disconnect from session so that the updates on updatedMinistrada are not directly saved in db
        em.detach(updatedMinistrada);
        updatedMinistrada.ano(UPDATED_ANO).ch(UPDATED_CH);

        restMinistradaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMinistrada.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMinistrada))
            )
            .andExpect(status().isOk());

        // Validate the Ministrada in the database
        List<Ministrada> ministradaList = ministradaRepository.findAll();
        assertThat(ministradaList).hasSize(databaseSizeBeforeUpdate);
        Ministrada testMinistrada = ministradaList.get(ministradaList.size() - 1);
        assertThat(testMinistrada.getAno()).isEqualTo(UPDATED_ANO);
        assertThat(testMinistrada.getCh()).isEqualTo(UPDATED_CH);
    }

    @Test
    @Transactional
    void putNonExistingMinistrada() throws Exception {
        int databaseSizeBeforeUpdate = ministradaRepository.findAll().size();
        ministrada.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMinistradaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ministrada.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ministrada))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ministrada in the database
        List<Ministrada> ministradaList = ministradaRepository.findAll();
        assertThat(ministradaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMinistrada() throws Exception {
        int databaseSizeBeforeUpdate = ministradaRepository.findAll().size();
        ministrada.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMinistradaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ministrada))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ministrada in the database
        List<Ministrada> ministradaList = ministradaRepository.findAll();
        assertThat(ministradaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMinistrada() throws Exception {
        int databaseSizeBeforeUpdate = ministradaRepository.findAll().size();
        ministrada.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMinistradaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ministrada)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ministrada in the database
        List<Ministrada> ministradaList = ministradaRepository.findAll();
        assertThat(ministradaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMinistradaWithPatch() throws Exception {
        // Initialize the database
        ministradaRepository.saveAndFlush(ministrada);

        int databaseSizeBeforeUpdate = ministradaRepository.findAll().size();

        // Update the ministrada using partial update
        Ministrada partialUpdatedMinistrada = new Ministrada();
        partialUpdatedMinistrada.setId(ministrada.getId());

        restMinistradaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMinistrada.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMinistrada))
            )
            .andExpect(status().isOk());

        // Validate the Ministrada in the database
        List<Ministrada> ministradaList = ministradaRepository.findAll();
        assertThat(ministradaList).hasSize(databaseSizeBeforeUpdate);
        Ministrada testMinistrada = ministradaList.get(ministradaList.size() - 1);
        assertThat(testMinistrada.getAno()).isEqualTo(DEFAULT_ANO);
        assertThat(testMinistrada.getCh()).isEqualTo(DEFAULT_CH);
    }

    @Test
    @Transactional
    void fullUpdateMinistradaWithPatch() throws Exception {
        // Initialize the database
        ministradaRepository.saveAndFlush(ministrada);

        int databaseSizeBeforeUpdate = ministradaRepository.findAll().size();

        // Update the ministrada using partial update
        Ministrada partialUpdatedMinistrada = new Ministrada();
        partialUpdatedMinistrada.setId(ministrada.getId());

        partialUpdatedMinistrada.ano(UPDATED_ANO).ch(UPDATED_CH);

        restMinistradaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMinistrada.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMinistrada))
            )
            .andExpect(status().isOk());

        // Validate the Ministrada in the database
        List<Ministrada> ministradaList = ministradaRepository.findAll();
        assertThat(ministradaList).hasSize(databaseSizeBeforeUpdate);
        Ministrada testMinistrada = ministradaList.get(ministradaList.size() - 1);
        assertThat(testMinistrada.getAno()).isEqualTo(UPDATED_ANO);
        assertThat(testMinistrada.getCh()).isEqualTo(UPDATED_CH);
    }

    @Test
    @Transactional
    void patchNonExistingMinistrada() throws Exception {
        int databaseSizeBeforeUpdate = ministradaRepository.findAll().size();
        ministrada.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMinistradaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ministrada.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ministrada))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ministrada in the database
        List<Ministrada> ministradaList = ministradaRepository.findAll();
        assertThat(ministradaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMinistrada() throws Exception {
        int databaseSizeBeforeUpdate = ministradaRepository.findAll().size();
        ministrada.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMinistradaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ministrada))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ministrada in the database
        List<Ministrada> ministradaList = ministradaRepository.findAll();
        assertThat(ministradaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMinistrada() throws Exception {
        int databaseSizeBeforeUpdate = ministradaRepository.findAll().size();
        ministrada.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMinistradaMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(ministrada))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ministrada in the database
        List<Ministrada> ministradaList = ministradaRepository.findAll();
        assertThat(ministradaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMinistrada() throws Exception {
        // Initialize the database
        ministradaRepository.saveAndFlush(ministrada);

        int databaseSizeBeforeDelete = ministradaRepository.findAll().size();

        // Delete the ministrada
        restMinistradaMockMvc
            .perform(delete(ENTITY_API_URL_ID, ministrada.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Ministrada> ministradaList = ministradaRepository.findAll();
        assertThat(ministradaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
