package com.guildforge.user;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public Map<String, Object> me(Authentication auth) {
        requireAuth(auth);
        return userService.getProfileByUsername(auth.getName());
    }

    @GetMapping("/me/guilds")
    public List<Map<String, Object>> myGuilds(Authentication auth) {
        requireAuth(auth);
        return userService.listMyGuildSummaries(auth.getName());
    }

    @GetMapping("/me/logs")
    public List<Map<String, Object>> myLogs(Authentication auth) {
        requireAuth(auth);
        return userService.listMyActivityLogs(auth.getName());
    }

    @GetMapping("/{id}")
    public Map<String, Object> byId(@PathVariable Long id) {
        return userService.getPublicProfile(id);
    }

    private void requireAuth(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
    }
}
