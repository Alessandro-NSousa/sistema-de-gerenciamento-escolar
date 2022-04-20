package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DiscenteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Discente.class);
        Discente discente1 = new Discente();
        discente1.setId(1L);
        Discente discente2 = new Discente();
        discente2.setId(discente1.getId());
        assertThat(discente1).isEqualTo(discente2);
        discente2.setId(2L);
        assertThat(discente1).isNotEqualTo(discente2);
        discente1.setId(null);
        assertThat(discente1).isNotEqualTo(discente2);
    }
}
