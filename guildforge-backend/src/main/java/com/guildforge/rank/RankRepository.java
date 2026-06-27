package com.guildforge.rank;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RankRepository extends JpaRepository<Rank, Long> {

    List<Rank> findByGuild_IdOrderByThresholdAsc(Long guildId);
}
