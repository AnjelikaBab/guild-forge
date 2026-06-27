package com.guildforge.rank;

import com.guildforge.guild.Guild;
import com.guildforge.guild.GuildRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RankService {

    private final RankRepository rankRepository;
    private final GuildRepository guildRepository;

    public RankService(RankRepository rankRepository, GuildRepository guildRepository) {
        this.rankRepository = rankRepository;
        this.guildRepository = guildRepository;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> listForGuild(Long guildId) {
        return rankRepository.findByGuild_IdOrderByThresholdAsc(guildId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> createRank(Long guildId, String name, int threshold) {
        Guild guild = guildRepository.findById(guildId).orElse(null);
        if (guild == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Guild not found");
        }
        Rank r = new Rank();
        r.setGuild(guild);
        r.setName(name);
        r.setThreshold(threshold);
        r = rankRepository.save(r);
        return toDto(r);
    }

    private Map<String, Object> toDto(Rank r) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", r.getId());
        m.put("guildId", r.getGuild().getId());
        m.put("name", r.getName());
        m.put("threshold", r.getThreshold());
        m.put("createdAt", r.getCreatedAt().toString());
        return m;
    }
}
