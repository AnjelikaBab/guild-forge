package com.guildforge.guild;

import com.guildforge.dsl.DslRulesEngine;
import com.guildforge.log.LogRepository;
import com.guildforge.membership.Membership;
import com.guildforge.membership.MembershipRankService;
import com.guildforge.membership.MembershipRepository;
import com.guildforge.user.User;
import com.guildforge.user.UserRepository;
import com.guildforge.user.UserRole;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class GuildService {

    private final GuildRepository guildRepository;
    private final MembershipRepository membershipRepository;
    private final UserRepository userRepository;
    private final LogRepository logRepository;
    private final MembershipRankService membershipRankService;
    private final DslRulesEngine dslRulesEngine = new DslRulesEngine();

    public GuildService(
            GuildRepository guildRepository,
            MembershipRepository membershipRepository,
            UserRepository userRepository,
            LogRepository logRepository,
            MembershipRankService membershipRankService) {
        this.guildRepository = guildRepository;
        this.membershipRepository = membershipRepository;
        this.userRepository = userRepository;
        this.logRepository = logRepository;
        this.membershipRankService = membershipRankService;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> listGuilds() {
        return guildRepository.findAllByOrderByNameAsc().stream().map(this::toSummary).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<Map<String, Object>> getGuild(Long id) {
        return guildRepository.findById(id).map(this::toDetail);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> leaderboard(Long guildId) {
        if (!guildRepository.existsById(guildId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        List<Membership> members = membershipRepository.findByGuild_Id(guildId);
        List<Map<String, Object>> rows = new ArrayList<>();
        for (Membership m : members) {
            Long uid = m.getUser().getId();
            long logCount = logRepository.countByUser_IdAndGuild_Id(uid, guildId);
            Map<String, Object> row = new HashMap<>();
            row.put("userId", uid);
            row.put("username", m.getUser().getUsername());
            row.put("rank", m.getRank());
            row.put("logCount", logCount);
            row.put("joinedAt", m.getJoinedAt().toString());
            rows.add(row);
        }
        rows.sort(Comparator.comparingLong((Map<String, Object> r) -> ((Number) r.get("logCount")).longValue())
                .reversed());
        return rows;
    }

    @Transactional
    public Map<String, Object> createGuild(
            String ownerUsername, String name, String theme, String description, String dslRules) {
        if (theme == null || theme.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Theme is required");
        }
        User owner = userRepository
                .findByUsername(ownerUsername)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Guild g = new Guild();
        g.setName(name);
        g.setTheme(theme);
        g.setDescription(description);
        g.setDslRules(dslRules);
        g.setOwner(owner);
        g = guildRepository.save(g);
        return toDetail(g);
    }

    @Transactional
    public Map<String, Object> updateDslRules(String username, Long guildId, String dslRules) {
        User actor = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Guild guild = guildRepository
                .findById(guildId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!canEditDsl(actor, guild)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the guild owner, a guild master, or an admin can edit rules");
        }
        String normalized = dslRules == null ? "" : dslRules.trim();
        if (!normalized.isEmpty()) {
            try {
                dslRulesEngine.parseRules(normalized);
            } catch (RuntimeException ex) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
            }
        }
        guild.setDslRules(normalized.isEmpty() ? null : normalized);
        guild = guildRepository.save(guild);
        membershipRankService.recalculateAllInGuild(guildId);
        return toDetail(guild);
    }

    private boolean canEditDsl(User actor, Guild guild) {
        if (actor.getRole() == UserRole.ADMIN || actor.getRole() == UserRole.GUILD_MASTER) {
            return true;
        }
        return guild.getOwner() != null && guild.getOwner().getId().equals(actor.getId());
    }

    private Map<String, Object> toSummary(Guild g) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", g.getId());
        m.put("name", g.getName());
        m.put("description", g.getDescription());
        m.put("theme", g.getTheme());
        m.put("ownerId", g.getOwner() != null ? g.getOwner().getId() : null);
        m.put("memberCount", membershipRepository.countByGuild_Id(g.getId()));
        return m;
    }

    private Map<String, Object> toDetail(Guild g) {
        Map<String, Object> m = new HashMap<>(toSummary(g));
        m.put("dslRules", g.getDslRules());
        m.put("createdAt", g.getCreatedAt().toString());
        return m;
    }
}
