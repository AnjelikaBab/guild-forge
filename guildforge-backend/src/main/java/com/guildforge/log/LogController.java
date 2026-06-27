package com.guildforge.log;

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
@RequestMapping("/api/logs")
public class LogController {

    private final LogService logService;

    public LogController(LogService logService) {
        this.logService = logService;
    }

    @GetMapping("/guild/{guildId}")
    public List<Map<String, Object>> forGuild(@PathVariable Long guildId) {
        return logService.listForGuild(guildId);
    }

    @PostMapping("/guild/{guildId}")
    public Map<String, Object> create(
            @PathVariable Long guildId, @RequestBody CreateLogRequest body, Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return logService.createLog(auth.getName(), guildId, body.description(), body.data());
    }

    public record CreateLogRequest(String description, Map<String, Object> data) {}
}
