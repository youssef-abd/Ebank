package ma.emsi.ebank.repository;

import ma.emsi.ebank.entity.CompteBancaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompteBancaireRepository extends JpaRepository<CompteBancaire, Long> {
    Optional<CompteBancaire> findByRib(String rib);
    boolean existsByRib(String rib);
    List<CompteBancaire> findByClientId(Long clientId);
    
    @Query("SELECT c FROM CompteBancaire c WHERE c.client.id = :clientId ORDER BY c.dateDerniereOperation DESC")
    List<CompteBancaire> findByClientIdOrderByDateDerniereOperationDesc(Long clientId);
}
