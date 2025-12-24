package ma.emsi.ebank.repository;

import ma.emsi.ebank.entity.Operation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OperationRepository extends JpaRepository<Operation, Long> {
    Page<Operation> findByCompteIdOrderByDateOperationDesc(Long compteId, Pageable pageable);
    List<Operation> findTop10ByCompteIdOrderByDateOperationDesc(Long compteId);
}
