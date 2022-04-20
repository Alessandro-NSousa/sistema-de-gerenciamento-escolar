package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Disciplina;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Disciplina entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DisciplinaRepository extends JpaRepository<Disciplina, Long> {}
