package com.guildforge.log;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogRepository extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findByGuild_IdOrderByLoggedAtDesc(Long guildId);

    long countByUser_IdAndGuild_Id(Long userId, Long guildId);

    List<ActivityLog> findByUser_IdOrderByLoggedAtDesc(Long userId);
}
