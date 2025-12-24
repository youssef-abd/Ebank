package ma.emsi.ebank.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.emsi.ebank.dto.ClientRequest;
import ma.emsi.ebank.dto.ClientResponse;
import ma.emsi.ebank.service.ClientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ClientController {
    
    private final ClientService clientService;
    
    @PostMapping
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<ClientResponse> createClient(@Valid @RequestBody ClientRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clientService.createClient(request));
    }
    
    @GetMapping
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<List<ClientResponse>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<ClientResponse> getClientById(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.getClientById(id));
    }
    
    @GetMapping("/numero/{numeroIdentite}")
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<ClientResponse> getClientByNumeroIdentite(@PathVariable String numeroIdentite) {
        return ResponseEntity.ok(clientService.getClientByNumeroIdentite(numeroIdentite));
    }
}
