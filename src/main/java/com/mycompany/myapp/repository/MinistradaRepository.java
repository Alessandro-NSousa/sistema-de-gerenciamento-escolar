package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Ministrada;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Ministrada entity.
 */
@Repository
public interface MinistradaRepository extends JpaRepository<Ministrada, Long> {
    default Optional<Ministrada> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Ministrada> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Ministrada> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct ministrada from Ministrada ministrada left join fetch ministrada.disciplina left join fetch ministrada.docente",
        countQuery = "select count(distinct ministrada) from Ministrada ministrada"
    )
    Page<Ministrada> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct ministrada from Ministrada ministrada left join fetch ministrada.disciplina left join fetch ministrada.docente")
    List<Ministrada> findAllWithToOneRelationships();

    @Query(
        "select ministrada from Ministrada ministrada left join fetch ministrada.disciplina left join fetch ministrada.docente where ministrada.id =:id"
    )
    Optional<Ministrada> findOneWithToOneRelationships(@Param("id") Long id);
}
