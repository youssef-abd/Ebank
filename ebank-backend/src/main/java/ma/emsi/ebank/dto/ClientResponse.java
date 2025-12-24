package ma.emsi.ebank.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientResponse {
    private Long id;
    private String nom;
    private String prenom;
    private String numeroIdentite;
    private LocalDate dateAnniversaire;
    private String email;
    private String adressePostale;
    private String username;
}
