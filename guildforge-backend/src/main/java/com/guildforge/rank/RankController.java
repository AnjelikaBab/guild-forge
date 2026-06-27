package com.guildforge.rank;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ranks")
public class RankController {

    private final RankService rankService;

    public RankController(RankService rankService) {
        this.rankService = rankService;
    }

    @GetMapping("/guild/{guildId}")
    public List<Map<String, Object>> forGuild(@PathVariable Long guildId) {
        return rankService.listForGuild(guildId);
    }

    @PostMapping("/guild/{guildId}")
    public Map<String, Object> create(@PathVariable Long guildId, @RequestBody CreateRankRequest body) {
        return rankService.createRank(guildId, body.name(), body.threshold());
    }

    public record CreateRankRequest(String name, int threshold) {}
}
