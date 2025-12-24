package ma.emsi.ebank.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.emsi.ebank.dto.DashboardResponse;
import ma.emsi.ebank.dto.OperationResponse;
import ma.emsi.ebank.dto.VirementRequest;
import ma.emsi.ebank.entity.*;
import ma.emsi.ebank.repository.ClientRepository;
import ma.emsi.ebank.repository.CompteBancaireRepository;
import ma.emsi.ebank.repository.OperationRepository;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OperationService {
    
    private final CompteBancaireRepository compteRepository;
    private final OperationRepository operationRepository;
    private final ClientRepository clientRepository;
    private final ModelMapper modelMapper;
    
    @Transactional
    public void effectuerVirement(VirementRequest request) {
        // Récupérer le compte source
        CompteBancaire compteSource = compteRepository.findByRib(request.getRibSource())
                .orElseThrow(() -> new RuntimeException("Compte source non trouvé"));
        
        // RG_11: Vérifier que le compte n'est pas bloqué ou clôturé
        if (compteSource.getStatut() != StatutCompte.OUVERT) {
            throw new RuntimeException("Le compte est " + compteSource.getStatut().name().toLowerCase());
        }
        
        // RG_12: Vérifier que le solde est suffisant
        if (compteSource.getSolde().compareTo(request.getMontant()) < 0) {
            throw new RuntimeException("Solde insuffisant");
        }
        
        // Récupérer le compte destinataire
        CompteBancaire compteDestinataire = compteRepository.findByRib(request.getRibDestinataire())
                .orElseThrow(() -> new RuntimeException("Compte destinataire non trouvé"));
        
        // Vérifier que le compte destinataire est ouvert
        if (compteDestinataire.getStatut() != StatutCompte.OUVERT) {
            throw new RuntimeException("Le compte destinataire n'est pas actif");
        }
        
        LocalDateTime dateOperation = LocalDateTime.now();
        
        // RG_13: Débiter le compte source
        compteSource.setSolde(compteSource.getSolde().subtract(request.getMontant()));
        compteSource.setDateDerniereOperation(dateOperation);
        
        // RG_14: Créditer le compte destinataire
        compteDestinataire.setSolde(compteDestinataire.getSolde().add(request.getMontant()));
        compteDestinataire.setDateDerniereOperation(dateOperation);
        
        // RG_15: Tracer l'opération de débit
        Operation operationDebit = new Operation();
        operationDebit.setIntitule("Virement vers " + request.getRibDestinataire());
        operationDebit.setType(TypeOperation.DEBIT);
        operationDebit.setMontant(request.getMontant());
        operationDebit.setDateOperation(dateOperation);
        operationDebit.setMotif(request.getMotif());
        operationDebit.setRibDestinataire(request.getRibDestinataire());
        operationDebit.setCompte(compteSource);
        
        // RG_15: Tracer l'opération de crédit
        Operation operationCredit = new Operation();
        operationCredit.setIntitule("Virement en votre faveur de " + request.getRibSource());
        operationCredit.setType(TypeOperation.CREDIT);
        operationCredit.setMontant(request.getMontant());
        operationCredit.setDateOperation(dateOperation);
        operationCredit.setMotif(request.getMotif());
        operationCredit.setRibDestinataire(request.getRibSource());
        operationCredit.setCompte(compteDestinataire);
        
        compteRepository.save(compteSource);
        compteRepository.save(compteDestinataire);
        operationRepository.save(operationDebit);
        operationRepository.save(operationCredit);
        
        log.info("Virement effectué: {} -> {}, Montant: {}", 
                request.getRibSource(), request.getRibDestinataire(), request.getMontant());
    }
    
    public DashboardResponse getDashboard(String rib, int page, int size) {
        CompteBancaire compte = compteRepository.findByRib(rib)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé"));
        
        // Vérifier que l'utilisateur connecté est le propriétaire du compte
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        if (!compte.getClient().getUser().getUsername().equals(username)) {
            throw new RuntimeException("Vous n'avez pas accès à ce compte");
        }
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Operation> operationsPage = operationRepository.findByCompteIdOrderByDateOperationDesc(
                compte.getId(), pageable);
        
        List<OperationResponse> operations = operationsPage.getContent().stream()
                .map(op -> modelMapper.map(op, OperationResponse.class))
                .collect(Collectors.toList());
        
        DashboardResponse response = new DashboardResponse();
        response.setRib(compte.getRib());
        response.setSolde(compte.getSolde());
        response.setDateDerniereOperation(compte.getDateDerniereOperation());
        response.setDernieresOperations(operations);
        response.setTotalOperations((int) operationsPage.getTotalElements());
        response.setCurrentPage(page);
        response.setTotalPages(operationsPage.getTotalPages());
        
        return response;
    }
    
    public DashboardResponse getDashboardForCurrentUser(int page, int size) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Client client = clientRepository.findByUserId(
                ((User) authentication.getPrincipal()).getId())
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));
        
        // Récupérer le compte le plus récemment mouvementé
        List<CompteBancaire> comptes = compteRepository.findByClientIdOrderByDateDerniereOperationDesc(client.getId());
        
        if (comptes.isEmpty()) {
            throw new RuntimeException("Aucun compte trouvé");
        }
        
        CompteBancaire compte = comptes.get(0);
        
        return getDashboard(compte.getRib(), page, size);
    }
    
    public List<OperationResponse> getTop10Operations(String rib) {
        CompteBancaire compte = compteRepository.findByRib(rib)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé"));
        
        return operationRepository.findTop10ByCompteIdOrderByDateOperationDesc(compte.getId())
                .stream()
                .map(op -> modelMapper.map(op, OperationResponse.class))
                .collect(Collectors.toList());
    }
}
