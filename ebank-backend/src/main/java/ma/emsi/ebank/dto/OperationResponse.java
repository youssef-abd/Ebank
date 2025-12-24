package ma.emsi.ebank.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.emsi.ebank.entity.TypeOperation;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OperationResponse {
    private Long id;
    private String intitule;
    private TypeOperation type;
    private BigDecimal montant;
    private LocalDateTime dateOperation;
    private String motif;
    private String ribDestinataire;
}
