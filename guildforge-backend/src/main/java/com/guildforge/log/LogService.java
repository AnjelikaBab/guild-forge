package com.guildforge.log;

import com.guildforge.guild.GuildRepository;
import com.guildforge.membership.MembershipRepository;
import com.guildforge.membership.MembershipRankService;
import com.guildforge.user.User;
import com.guildforge.user.UserRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LogService {

    private final LogRepository logRepository;
    private final UserRepository userRepository;
    private final GuildRepository guildRepository;
    private final MembershipRepository membershipRepository;
    private final MembershipRankService membershipRankService;

    public LogService(
            LogRepository logRepository,
            UserRepository userRepository,
            GuildRepository guildRepository,
            MembershipRepository membershipRepository,
            MembershipRankService membershipRankService) {
        this.logRepository = logRepository;
        this.userRepository = userRepository;
        this.guildRepository = guildRepository;
        this.membershipRepository = membershipRepository;
        this.membershipRankService = membershipRankService;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> listForGuild(Long guildId) {
        if (!guildRepository.existsById(guildId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return logRepository.findByGuild_IdOrderByLoggedAtDesc(guildId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> createLog(String username, Long guildId, String description, Map<String, Object> data) {
        if (description == null || description.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Description required");
        }
        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var guild = guildRepository.findById(guildId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (membershipRepository.findByUser_IdAndGuild_Id(user.getId(), guildId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Join this guild before logging activity");
        }
        ActivityLog log = new ActivityLog();
        log.setUser(user);
        log.setGuild(guild);
        log.setDescription(description.trim());
        log.setData(data != null && !data.isEmpty() ? data : null);
        log = logRepository.save(log);
        membershipRankService.recalculateRankForMember(user.getId(), guildId);
        return toDto(log);
    }

    private Map<String, Object> toDto(ActivityLog log) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", log.getId());
        m.put("guildId", log.getGuild().getId());
        m.put("userId", log.getUser().getId());
        m.put("username", log.getUser().getUsername());
        m.put("description", log.getDescription());
        m.put("data", log.getData());
        m.put("loggedAt", log.getLoggedAt().toString());
        return m;
    }
}
