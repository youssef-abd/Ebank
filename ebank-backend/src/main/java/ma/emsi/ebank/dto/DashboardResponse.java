package ma.emsi.ebank.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private String rib;
    private BigDecimal solde;
    private LocalDateTime dateDerniereOperation;
    private List<OperationResponse> dernieresOperations;
    private int totalOperations;
    private int currentPage;
    private int totalPages;
}
