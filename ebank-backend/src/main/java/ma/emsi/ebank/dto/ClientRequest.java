package ma.emsi.ebank.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientRequest {
    
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;
    
    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;
    
    @NotBlank(message = "Le numéro d'identité est obligatoire")
    private String numeroIdentite;
    
    @NotNull(message = "La date d'anniversaire est obligatoire")
    private LocalDate dateAnniversaire;
    
    @NotBlank(message = "L'adresse email est obligatoire")
    @Email(message = "L'adresse email doit être valide")
    private String email;
    
    @NotBlank(message = "L'adresse postale est obligatoire")
    private String adressePostale;
}
