package ma.emsi.ebank.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VirementRequest {
    
    @NotBlank(message = "Le RIB source est obligatoire")
    private String ribSource;
    
    @NotBlank(message = "Le RIB destinataire est obligatoire")
    private String ribDestinataire;
    
    @NotNull(message = "Le montant est obligatoire")
    @DecimalMin(value = "0.01", message = "Le montant doit être supérieur à 0")
    private BigDecimal montant;
    
    private String motif;
}
