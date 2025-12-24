package ma.emsi.ebank.config;

import lombok.RequiredArgsConstructor;
import ma.emsi.ebank.entity.Role;
import ma.emsi.ebank.entity.User;
import ma.emsi.ebank.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // Créer un Agent Guichet par défaut si n'existe pas
            if (!userRepository.existsByUsername("admin")) {
                User agent = new User();
                agent.setUsername("admin");
                agent.setPassword(passwordEncoder.encode("admin"));
                agent.setRole(Role.AGENT_GUICHET);
                agent.setEnabled(true);
                userRepository.save(agent);
                System.out.println("ACHTUNG: Agent Guichet par défaut créé (Login: admin / Pass: admin)");
            }
        };
    }
}
