package ma.emsi.ebank.service;

import ma.emsi.ebank.dto.CompteRequest;
import ma.emsi.ebank.dto.CompteResponse;
import ma.emsi.ebank.entity.Client;
import ma.emsi.ebank.entity.CompteBancaire;
import ma.emsi.ebank.entity.StatutCompte;
import ma.emsi.ebank.repository.ClientRepository;
import ma.emsi.ebank.repository.CompteBancaireRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CompteServiceTest {

    @Mock
    private CompteBancaireRepository compteRepository;

    @Mock
    private ClientRepository clientRepository;
    
    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private CompteService compteService;

    @Test
    void createCompte_ShouldCreateAccountWithStatusOuvert() {
        // Arrange
        String rib = "123456789012345678901234";
        CompteRequest request = new CompteRequest();
        request.setNumeroIdentite("AB123456");
        request.setRib(rib);

        Client client = new Client();
        client.setNumeroIdentite("AB123456");
        client.setNom("Test");
        client.setPrenom("User");

        // Mock du Repository Client
        when(clientRepository.findByNumeroIdentite("AB123456")).thenReturn(Optional.of(client));
        
        // Mock du Repository Compte (check existance)
        when(compteRepository.existsByRib(anyString())).thenReturn(false);
        
        // Mock du Repository Save (retourne l'objet avec le bon statut)
        when(compteRepository.save(any(CompteBancaire.class))).thenAnswer(invocation -> {
            CompteBancaire c = invocation.getArgument(0);
            c.setId(1L);
            return c;
        });
        
        // Mock du ModelMapper
        CompteResponse expectedResponse = new CompteResponse();
        expectedResponse.setRib(rib);
        expectedResponse.setStatut(StatutCompte.OUVERT);
        
        when(modelMapper.map(any(CompteBancaire.class), eq(CompteResponse.class))).thenReturn(expectedResponse);

        // Act
        CompteResponse result = compteService.createCompte(request);

        // Assert
        assertNotNull(result);
        assertEquals(StatutCompte.OUVERT, result.getStatut(), "RG_10: Le compte doit avoir le statut OUVERT");
        assertEquals(rib, result.getRib());
        
        // Vérifier que le repository a bien été appelé avec un compte au statut OUVERT
        verify(compteRepository).save(argThat(compte -> 
            compte.getStatut() == StatutCompte.OUVERT &&
            compte.getRib().equals(rib)
        ));
    }
}
