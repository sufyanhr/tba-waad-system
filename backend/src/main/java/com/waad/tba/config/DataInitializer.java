package com.waad.tba.config;

import com.waad.tba.model.User;
import com.waad.tba.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            if (userRepository.count() == 0) {
                log.info("Initializing default users...");
                
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@tba-waad.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setFullName("System Administrator");
                admin.setPhone("+1234567890");
                admin.setActive(true);
                admin.setRoles(Set.of(User.Role.ADMIN, User.Role.INSURANCE));
                userRepository.save(admin);
                log.info("Created admin user: admin / admin123");
                
                User insurance = new User();
                insurance.setUsername("insurance");
                insurance.setEmail("insurance@tba-waad.com");
                insurance.setPassword(passwordEncoder.encode("insurance123"));
                insurance.setFullName("Insurance Staff");
                insurance.setPhone("+1234567891");
                insurance.setActive(true);
                insurance.setRoles(Set.of(User.Role.INSURANCE));
                userRepository.save(insurance);
                log.info("Created insurance user: insurance / insurance123");
                
                User provider = new User();
                provider.setUsername("provider");
                provider.setEmail("provider@hospital.com");
                provider.setPassword(passwordEncoder.encode("provider123"));
                provider.setFullName("Healthcare Provider");
                provider.setPhone("+1234567892");
                provider.setActive(true);
                provider.setRoles(Set.of(User.Role.PROVIDER));
                userRepository.save(provider);
                log.info("Created provider user: provider / provider123");
                
                User employer = new User();
                employer.setUsername("employer");
                employer.setEmail("hr@company.com");
                employer.setPassword(passwordEncoder.encode("employer123"));
                employer.setFullName("HR Manager");
                employer.setPhone("+1234567893");
                employer.setActive(true);
                employer.setRoles(Set.of(User.Role.EMPLOYER));
                userRepository.save(employer);
                log.info("Created employer user: employer / employer123");
                
                User member = new User();
                member.setUsername("member");
                member.setEmail("member@email.com");
                member.setPassword(passwordEncoder.encode("member123"));
                member.setFullName("John Member");
                member.setPhone("+1234567894");
                member.setActive(true);
                member.setRoles(Set.of(User.Role.MEMBER));
                userRepository.save(member);
                log.info("Created member user: member / member123");
                
                log.info("Database initialization completed!");
            } else {
                log.info("Database already contains users. Skipping initialization.");
            }
        };
    }
}
