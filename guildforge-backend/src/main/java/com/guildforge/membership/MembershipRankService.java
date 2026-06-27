package com.guildforge.membership;

import com.guildforge.log.LogRepository;
import com.guildforge.rank.Rank;
import com.guildforge.rank.RankRepository;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MembershipRankService {

    private final MembershipRepository membershipRepository;
    private final LogRepository logRepository;
    private final RankRepository rankRepository;

    public MembershipRankService(
            MembershipRepository membershipRepository,
            LogRepository logRepository,
            RankRepository rankRepository) {
        this.membershipRepository = membershipRepository;
        this.logRepository = logRepository;
        this.rankRepository = rankRepository;
    }

    /**
     * Recomputes {@link Membership#getRank()} from the guild's {@code ranks} thresholds and the
     * member's activity log count. This is the bridge until the multi-line rule DSL drives ranks directly.
     */
    @Transactional
    public void recalculateRankForMember(Long userId, Long guildId) {
        membershipRepository
                .findByUser_IdAndGuild_Id(userId, guildId)
                .ifPresent(membership -> {
                    long logCount = logRepository.countByUser_IdAndGuild_Id(userId, guildId);
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
                    membership.setRank(rankName);
                    membershipRepository.save(membership);
                });
    }
}
