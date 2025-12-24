package ma.emsi.ebank.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.emsi.ebank.dto.CompteRequest;
import ma.emsi.ebank.dto.CompteResponse;
import ma.emsi.ebank.service.CompteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compte")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class CompteController {
    
    private final CompteService compteService;
    
    @PostMapping
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<CompteResponse> createCompte(@Valid @RequestBody CompteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(compteService.createCompte(request));
    }
    
    @GetMapping
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<List<CompteResponse>> getAllComptes() {
        return ResponseEntity.ok(compteService.getAllComptes());
    }
    
    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<List<CompteResponse>> getComptesByClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(compteService.getComptesByClient(clientId));
    }
    
    @GetMapping("/rib/{rib}")
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<CompteResponse> getCompteByRib(@PathVariable String rib) {
        return ResponseEntity.ok(compteService.getCompteByRib(rib));
    }
}
