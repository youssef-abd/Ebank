package ma.emsi.ebank.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private JavaMailSender mailSender;
    
    public void sendCredentials(String to, String username, String password) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Bienvenue sur eBank - Vos identifiants de connexion");
            message.setText(String.format(
                    "Bonjour,\n\n" +
                    "Votre compte eBank a été créé avec succès.\n\n" +
                    "Voici vos identifiants de connexion :\n" +
                    "Login: %s\n" +
                    "Mot de passe: %s\n\n" +
                    "Pour des raisons de sécurité, nous vous recommandons de changer votre mot de passe lors de votre première connexion.\n\n" +
                    "Cordialement,\n" +
                    "L'équipe eBank",
                    username, password
            ));
            
            if (mailSender != null) {
                mailSender.send(message);
                log.info("Email sent successfully to: {}", to);
            } else {
                log.warn("JavaMailSender not configured. Email NOT sent to {}. Check logs for credentials.", to);
            }
        } catch (Exception e) {
            log.error("Failed to send email to: {}", to, e);
            // On ne lance pas d'exception bloquante pour ne pas annuler la création du client si le mail échoue
        }
    }
}
