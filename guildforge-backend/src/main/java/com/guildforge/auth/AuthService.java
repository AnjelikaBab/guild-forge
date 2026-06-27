package com.guildforge.auth;

import com.guildforge.user.User;
import com.guildforge.user.UserRepository;
import com.guildforge.user.UserRole;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public Map<String, Object> signup(String username, String email, String rawPassword) {
        if (userRepository.existsByUsername(username)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
        }
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(UserRole.MEMBER);
        user = userRepository.save(user);
        return tokenResponse(user);
    }

    public Map<String, Object> login(String username, String rawPassword) {
        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        return tokenResponse(user);
    }

    private Map<String, Object> tokenResponse(User user) {
        String token = jwtUtil.createToken(user.getUsername(), user.getId(), user.getRole().name());
        Map<String, Object> m = new HashMap<>();
        m.put("token", token);
        m.put(
                "user",
                Map.of(
                        "id",
                        user.getId(),
                        "username",
                        user.getUsername(),
                        "email",
                        user.getEmail(),
                        "role",
                        user.getRole().name()));
        return m;
    }
}
