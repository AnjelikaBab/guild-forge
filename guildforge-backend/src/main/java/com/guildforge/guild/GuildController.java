package com.guildforge.guild;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/guilds")
public class GuildController {

    private final GuildService guildService;

    public GuildController(GuildService guildService) {
        this.guildService = guildService;
    }

    @GetMapping
    public List<Map<String, Object>> list() {
        return guildService.listGuilds();
    }

    @GetMapping("/{id}/leaderboard")
    public List<Map<String, Object>> leaderboard(@PathVariable Long id) {
        return guildService.leaderboard(id);
    }

    @GetMapping("/{id}")
    public Map<String, Object> get(@PathVariable Long id) {
        return guildService.getGuild(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody CreateGuildRequest body, Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return guildService.createGuild(auth.getName(), body.name(), body.theme(), body.description(), body.dslRules());
    }

    public record CreateGuildRequest(String name, String theme, String description, String dslRules) {}
}
