package com.guildforge.admin;

import com.guildforge.guild.GuildService;
import com.guildforge.user.User;
import com.guildforge.user.UserRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final GuildService guildService;

    public AdminController(UserRepository userRepository, GuildService guildService) {
        this.userRepository = userRepository;
        this.guildService = guildService;
    }

    @GetMapping("/users")
    public List<Map<String, Object>> users() {
        return userRepository.findAll().stream().map(this::userRow).collect(Collectors.toList());
    }

    @GetMapping("/guilds")
    public List<Map<String, Object>> guilds() {
        return guildService.listGuilds();
    }

    private Map<String, Object> userRow(User u) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", u.getId());
        m.put("username", u.getUsername());
        m.put("email", u.getEmail());
        m.put("role", u.getRole().name());
        m.put("createdAt", u.getCreatedAt().toString());
        return m;
    }
}
