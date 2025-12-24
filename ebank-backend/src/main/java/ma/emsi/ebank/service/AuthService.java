package ma.emsi.ebank.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.emsi.ebank.dto.AuthResponse;
import ma.emsi.ebank.dto.ChangePasswordRequest;
import ma.emsi.ebank.dto.LoginRequest;
import ma.emsi.ebank.entity.Client;
import ma.emsi.ebank.entity.User;
import ma.emsi.ebank.repository.ClientRepository;
import ma.emsi.ebank.repository.UserRepository;
import ma.emsi.ebank.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    
    @Transactional
    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("Login ou mot de passe erronés"));
            
            String token = jwtTokenProvider.generateToken(user.getUsername());
            
            Long clientId = null;
            if (user.getClient() != null) {
                clientId = user.getClient().getId();
            }
            
            log.info("User {} logged in successfully", user.getUsername());
            
            return new AuthResponse(token, user.getUsername(), user.getRole(), clientId);
            
        } catch (Exception e) {
            log.error("Authentication failed for user: {}", request.getUsername());
            throw new RuntimeException("Login ou mot de passe erronés");
        }
    }
    
    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("L'ancien mot de passe est incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        log.info("Password changed successfully for user: {}", username);
    }
}
