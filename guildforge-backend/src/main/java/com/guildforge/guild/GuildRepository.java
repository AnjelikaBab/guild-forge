package com.guildforge.guild;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuildRepository extends JpaRepository<Guild, Long> {

    Optional<Guild> findByName(String name);

    List<Guild> findAllByOrderByNameAsc();
}
