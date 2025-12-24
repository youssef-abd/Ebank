package ma.emsi.ebank.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "operations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Operation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String intitule;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeOperation type;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal montant;
    
    @Column(nullable = false)
    private LocalDateTime dateOperation = LocalDateTime.now();
    
    private String motif;
    
    private String ribDestinataire;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "compte_id", nullable = false)
    private CompteBancaire compte;
}
