package com.waad.tba.security;

import com.waad.tba.model.User;
import com.waad.tba.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        // نحاول باسم المستخدم
        Optional<User> byUsername = userRepository.findByUsername(identifier);
        if (byUsername.isPresent()) {
            return byUsername.get();
        }

        // نحاول بالبريد
        User byEmail = userRepository.findByEmail(identifier);
        if (byEmail != null) {
            return byEmail;
        }

        // نحاول بالهاتف
        User byPhone = userRepository.findByPhone(identifier);
        if (byPhone != null) {
            return byPhone;
        }

        throw new UsernameNotFoundException("User not found with identifier: " + identifier);
    }
}
