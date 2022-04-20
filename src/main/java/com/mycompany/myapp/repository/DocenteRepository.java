package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Docente;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Docente entity.
 */
@Repository
public interface DocenteRepository extends JpaRepository<Docente, Long> {
    default Optional<Docente> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Docente> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Docente> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct docente from Docente docente left join fetch docente.endereco",
        countQuery = "select count(distinct docente) from Docente docente"
    )
    Page<Docente> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct docente from Docente docente left join fetch docente.endereco")
    List<Docente> findAllWithToOneRelationships();

    @Query("select docente from Docente docente left join fetch docente.endereco where docente.id =:id")
    Optional<Docente> findOneWithToOneRelationships(@Param("id") Long id);
}
