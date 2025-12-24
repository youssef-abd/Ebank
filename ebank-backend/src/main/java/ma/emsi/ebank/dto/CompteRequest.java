package ma.emsi.ebank.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompteRequest {
    
    @NotBlank(message = "Le RIB est obligatoire")
    private String rib;
    
    @NotBlank(message = "Le numéro d'identité du client est obligatoire")
    private String numeroIdentite;
}
