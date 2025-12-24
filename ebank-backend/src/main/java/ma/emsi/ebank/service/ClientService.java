package ma.emsi.ebank.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.emsi.ebank.dto.ClientRequest;
import ma.emsi.ebank.dto.ClientResponse;
import ma.emsi.ebank.entity.Client;
import ma.emsi.ebank.entity.Role;
import ma.emsi.ebank.entity.User;
import ma.emsi.ebank.repository.ClientRepository;
import ma.emsi.ebank.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClientService {
    
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final ModelMapper modelMapper;
    
    @Transactional
    public ClientResponse createClient(ClientRequest request) {
        // RG_4: Vérifier l'unicité du numéro d'identité
        if (clientRepository.existsByNumeroIdentite(request.getNumeroIdentite())) {
            throw new RuntimeException("Le numéro d'identité existe déjà");
        }
        
        // RG_6: Vérifier l'unicité de l'email
        if (clientRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("L'adresse email existe déjà");
        }
        
        // Créer l'utilisateur
        String username = generateUsername(request.getNom(), request.getPrenom());
        String password = generateRandomPassword();
        
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password)); // RG_1: Cryptage du mot de passe
        user.setRole(Role.CLIENT);
        user.setEnabled(true);
        
        user = userRepository.save(user);
        
        // Créer le client
        Client client = modelMapper.map(request, Client.class);
        client.setUser(user);
        
        client = clientRepository.save(client);
        
        // RG_7: Envoyer un email avec les identifiants
        try {
            emailService.sendCredentials(client.getEmail(), username, password);
            log.info("Credentials sent to client email: {}", client.getEmail());
        } catch (Exception e) {
            log.error("Failed to send email to: {}", client.getEmail(), e);
        }
        
        log.info("Client created successfully: {}", client.getNumeroIdentite());
        
        ClientResponse response = modelMapper.map(client, ClientResponse.class);
        response.setUsername(username);
        
        return response;
    }
    
    public List<ClientResponse> getAllClients() {
        return clientRepository.findAll().stream()
                .map(client -> {
                    ClientResponse response = modelMapper.map(client, ClientResponse.class);
                    response.setUsername(client.getUser().getUsername());
                    return response;
                })
                .collect(Collectors.toList());
    }
    
    public ClientResponse getClientById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));
        
        ClientResponse response = modelMapper.map(client, ClientResponse.class);
        response.setUsername(client.getUser().getUsername());
        
        return response;
    }
    
    public ClientResponse getClientByNumeroIdentite(String numeroIdentite) {
        Client client = clientRepository.findByNumeroIdentite(numeroIdentite)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));
        
        ClientResponse response = modelMapper.map(client, ClientResponse.class);
        response.setUsername(client.getUser().getUsername());
        
        return response;
    }
    
    private String generateUsername(String nom, String prenom) {
        String baseUsername = (prenom.substring(0, 1) + nom).toLowerCase().replaceAll("\\s+", "");
        String username = baseUsername;
        int counter = 1;
        
        while (userRepository.existsByUsername(username)) {
            username = baseUsername + counter++;
        }
        
        return username;
    }
    
    private String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder();
        
        for (int i = 0; i < 12; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }
        
        return password.toString();
    }
}
