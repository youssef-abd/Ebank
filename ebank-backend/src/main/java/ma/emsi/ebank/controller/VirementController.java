package ma.emsi.ebank.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.emsi.ebank.dto.VirementRequest;
import ma.emsi.ebank.service.OperationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/virement")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class VirementController {
    
    private final OperationService operationService;
    
    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<String> effectuerVirement(@Valid @RequestBody VirementRequest request) {
        operationService.effectuerVirement(request);
        return ResponseEntity.ok("Virement effectué avec succès");
    }
}
