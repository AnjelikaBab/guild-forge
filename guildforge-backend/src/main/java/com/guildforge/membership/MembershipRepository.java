package com.guildforge.membership;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MembershipRepository extends JpaRepository<Membership, Long> {

    Optional<Membership> findByUser_IdAndGuild_Id(Long userId, Long guildId);

    List<Membership> findByUser_Id(Long userId);

    List<Membership> findByGuild_Id(Long guildId);

    long countByGuild_Id(Long guildId);
}
