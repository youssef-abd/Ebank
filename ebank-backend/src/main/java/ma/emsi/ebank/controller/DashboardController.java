package ma.emsi.ebank.controller;

import lombok.RequiredArgsConstructor;
import ma.emsi.ebank.dto.DashboardResponse;
import ma.emsi.ebank.dto.OperationResponse;
import ma.emsi.ebank.service.OperationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class DashboardController {
    
    private final OperationService operationService;
    
    @GetMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<DashboardResponse> getDashboard(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(operationService.getDashboardForCurrentUser(page, size));
    }
    
    @GetMapping("/compte/{rib}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<DashboardResponse> getDashboardByRib(
            @PathVariable String rib,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(operationService.getDashboard(rib, page, size));
    }
    
    @GetMapping("/operations/top10/{rib}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<OperationResponse>> getTop10Operations(@PathVariable String rib) {
        return ResponseEntity.ok(operationService.getTop10Operations(rib));
    }
}
