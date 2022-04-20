package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MinistradaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Ministrada.class);
        Ministrada ministrada1 = new Ministrada();
        ministrada1.setId(1L);
        Ministrada ministrada2 = new Ministrada();
        ministrada2.setId(ministrada1.getId());
        assertThat(ministrada1).isEqualTo(ministrada2);
        ministrada2.setId(2L);
        assertThat(ministrada1).isNotEqualTo(ministrada2);
        ministrada1.setId(null);
        assertThat(ministrada1).isNotEqualTo(ministrada2);
    }
}
