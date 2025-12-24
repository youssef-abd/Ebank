package ma.emsi.ebank.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.emsi.ebank.entity.StatutCompte;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompteResponse {
    private Long id;
    private String rib;
    private BigDecimal solde;
    private StatutCompte statut;
    private LocalDateTime dateCreation;
    private LocalDateTime dateDerniereOperation;
    private String clientNom;
    private String clientPrenom;
}
