package ma.emsi.ebank.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.emsi.ebank.dto.CompteRequest;
import ma.emsi.ebank.dto.CompteResponse;
import ma.emsi.ebank.entity.Client;
import ma.emsi.ebank.entity.CompteBancaire;
import ma.emsi.ebank.entity.StatutCompte;
import ma.emsi.ebank.repository.ClientRepository;
import ma.emsi.ebank.repository.CompteBancaireRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompteService {
    
    private final CompteBancaireRepository compteRepository;
    private final ClientRepository clientRepository;
    private final ModelMapper modelMapper;
    
    @Transactional
    public CompteResponse createCompte(CompteRequest request) {
        // RG_8: Vérifier que le numéro d'identité existe
        Client client = clientRepository.findByNumeroIdentite(request.getNumeroIdentite())
                .orElseThrow(() -> new RuntimeException("Le numéro d'identité n'existe pas"));
        
        // RG_9: Valider le RIB
        if (!isValidRib(request.getRib())) {
            throw new RuntimeException("Le RIB n'est pas valide");
        }
        
        // Vérifier que le RIB n'existe pas déjà
        if (compteRepository.existsByRib(request.getRib())) {
            throw new RuntimeException("Le RIB existe déjà");
        }
        
        // Créer le compte
        CompteBancaire compte = new CompteBancaire();
        compte.setRib(request.getRib());
        compte.setClient(client);
        compte.setSolde(new BigDecimal(3000));
        compte.setStatut(StatutCompte.OUVERT); // RG_10: Statut OUVERT par défaut
        compte.setDateCreation(LocalDateTime.now());
        
        compte = compteRepository.save(compte);
        
        log.info("Compte bancaire créé: RIB={}, Client={}", compte.getRib(), client.getNumeroIdentite());
        
        CompteResponse response = modelMapper.map(compte, CompteResponse.class);
        response.setClientNom(client.getNom());
        response.setClientPrenom(client.getPrenom());
        
        return response;
    }
    
    public List<CompteResponse> getComptesByClient(Long clientId) {
        return compteRepository.findByClientId(clientId).stream()
                .map(compte -> {
                    CompteResponse response = modelMapper.map(compte, CompteResponse.class);
                    response.setClientNom(compte.getClient().getNom());
                    response.setClientPrenom(compte.getClient().getPrenom());
                    return response;
                })
                .collect(Collectors.toList());
    }
    
    public CompteResponse getCompteByRib(String rib) {
        CompteBancaire compte = compteRepository.findByRib(rib)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé"));
        
        CompteResponse response = modelMapper.map(compte, CompteResponse.class);
        response.setClientNom(compte.getClient().getNom());
        response.setClientPrenom(compte.getClient().getPrenom());
        
        return response;
    }
    
    public List<CompteResponse> getAllComptes() {
        return compteRepository.findAll().stream()
                .map(compte -> {
                    CompteResponse response = modelMapper.map(compte, CompteResponse.class);
                    response.setClientNom(compte.getClient().getNom());
                    response.setClientPrenom(compte.getClient().getPrenom());
                    return response;
                })
                .collect(Collectors.toList());
    }
    
    private boolean isValidRib(String rib) {
        // Validation basique du RIB (24 caractères alphanumériques)
        // Pour une validation complète, implémenter l'algorithme de contrôle du RIB
        if (rib == null || rib.length() != 24) {
            return false;
        }
        
        return rib.matches("[A-Z0-9]{24}");
    }
}
