package ma.emsi.ebank.repository;

import ma.emsi.ebank.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByNumeroIdentite(String numeroIdentite);
    boolean existsByNumeroIdentite(String numeroIdentite);
    boolean existsByEmail(String email);
    Optional<Client> findByUserId(Long userId);
}
