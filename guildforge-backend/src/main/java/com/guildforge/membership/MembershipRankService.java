package com.guildforge.membership;

import com.guildforge.dsl.DslRulesEngine;
import com.guildforge.guild.Guild;
import com.guildforge.guild.GuildRepository;
import com.guildforge.log.LogRepository;
import com.guildforge.rank.Rank;
import com.guildforge.rank.RankRepository;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MembershipRankService {

    private final MembershipRepository membershipRepository;
    private final LogRepository logRepository;
    private final RankRepository rankRepository;
    private final GuildRepository guildRepository;
    private final DslRulesEngine dslRulesEngine = new DslRulesEngine();

    public MembershipRankService(
            MembershipRepository membershipRepository,
            LogRepository logRepository,
            RankRepository rankRepository,
            GuildRepository guildRepository) {
        this.membershipRepository = membershipRepository;
        this.logRepository = logRepository;
        this.rankRepository = rankRepository;
        this.guildRepository = guildRepository;
    }

    @Transactional
    public void recalculateRankForMember(Long userId, Long guildId) {
        membershipRepository
                .findByUser_IdAndGuild_Id(userId, guildId)
                .ifPresent(membership -> {
                    long logCount = logRepository.countByUser_IdAndGuild_Id(userId, guildId);
                    String rankName = resolveRank(guildId, logCount);
                    membership.setRank(rankName);
                    membershipRepository.save(membership);
                });
    }

    @Transactional
    public void recalculateAllInGuild(Long guildId) {
        for (Membership membership : membershipRepository.findByGuild_Id(guildId)) {
            recalculateRankForMember(membership.getUser().getId(), guildId);
        }
    }

    private String resolveRank(Long guildId, long logCount) {
        Guild guild = guildRepository.findById(guildId).orElse(null);
        if (guild != null && guild.getDslRules() != null && !guild.getDslRules().isBlank()) {
            try {
                String fromDsl = dslRulesEngine.resolveRank(guild.getDslRules(), Map.of("logs", logCount));
                if (fromDsl != null && !fromDsl.isBlank()) {
                    return fromDsl;
                }
            } catch (RuntimeException ignored) {
                // fall through to threshold ladder
            }
        }
        return resolveFromThresholds(guildId, logCount);
    }

    private String resolveFromThresholds(Long guildId, long logCount) {
        List<Rank> ranks = rankRepository.findByGuild_IdOrderByThresholdAsc(guildId);
        String rankName = "Newcomer";
        if (!ranks.isEmpty()) {
            List<Rank> byHigh = ranks.stream()
                    .sorted(Comparator.comparingInt(Rank::getThreshold).reversed())
                    .toList();
            for (Rank r : byHigh) {
                if (logCount >= r.getThreshold()) {
                    rankName = r.getName();
                    break;
                }
            }
        }
        return rankName;
    }
}
