package com.guildforge.user;

import com.guildforge.log.ActivityLog;
import com.guildforge.log.LogRepository;
import com.guildforge.membership.MembershipRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;
    private final LogRepository logRepository;

    public UserService(
            UserRepository userRepository,
            MembershipRepository membershipRepository,
            LogRepository logRepository) {
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
        this.logRepository = logRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getProfileByUsername(String username) {
        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return toProfile(user, true);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPublicProfile(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return toProfile(user, false);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> listMyGuildSummaries(String username) {
        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        List<Map<String, Object>> out = new ArrayList<>();
        for (var m : membershipRepository.findByUser_Id(user.getId())) {
            var g = m.getGuild();
            long logCount = logRepository.countByUser_IdAndGuild_Id(user.getId(), g.getId());
            Map<String, Object> row = new HashMap<>();
            row.put("guildId", g.getId());
            row.put("guildName", g.getName());
            row.put("theme", g.getTheme());
            row.put("rank", m.getRank());
            row.put("joinedAt", m.getJoinedAt().toString());
            row.put("logCount", logCount);
            out.add(row);
        }
        return out;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> listMyActivityLogs(String username) {
        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return logRepository.findByUser_IdOrderByLoggedAtDesc(user.getId()).stream()
                .map(this::logToBrief)
                .collect(Collectors.toList());
    }

    private Map<String, Object> logToBrief(ActivityLog log) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", log.getId());
        m.put("guildId", log.getGuild().getId());
        m.put("guildName", log.getGuild().getName());
        m.put("description", log.getDescription());
        m.put("data", log.getData());
        m.put("loggedAt", log.getLoggedAt().toString());
        return m;
    }

    private Map<String, Object> toProfile(User user, boolean includeEmail) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", user.getId());
        m.put("username", user.getUsername());
        m.put("role", user.getRole().name());
        if (includeEmail) {
            m.put("email", user.getEmail());
        }
        m.put("createdAt", user.getCreatedAt().toString());
        List<Long> guildIds = membershipRepository.findByUser_Id(user.getId()).stream()
                .map(mm -> mm.getGuild().getId())
                .collect(Collectors.toList());
        m.put("guildIds", guildIds);
        return m;
    }
}
