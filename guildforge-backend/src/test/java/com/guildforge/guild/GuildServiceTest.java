package com.guildforge.guild;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.guildforge.log.LogRepository;
import com.guildforge.membership.MembershipRepository;
import com.guildforge.user.UserRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GuildServiceTest {

    @Mock
    private GuildRepository guildRepository;

    @Mock
    private MembershipRepository membershipRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private LogRepository logRepository;

    @InjectMocks
    private GuildService guildService;

    @Test
    void listGuildsIncludesMemberCounts() {
        Guild g1 = new Guild();
        g1.setId(1L);
        g1.setName("Alpha");
        g1.setDescription("d");
        g1.setTheme("ember");
        Guild g2 = new Guild();
        g2.setId(2L);
        g2.setName("Beta");
        g2.setDescription(null);
        g2.setTheme("default");

        when(guildRepository.findAllByOrderByNameAsc()).thenReturn(List.of(g1, g2));
        when(membershipRepository.countByGuild_Id(1L)).thenReturn(5L);
        when(membershipRepository.countByGuild_Id(2L)).thenReturn(0L);

        var list = guildService.listGuilds();
        assertThat(list).hasSize(2);
        assertThat(list.getFirst().get("memberCount")).isEqualTo(5L);
        assertThat(list.get(1).get("memberCount")).isEqualTo(0L);
    }

    @Test
    void getGuildReturnsEmptyWhenMissing() {
        when(guildRepository.findById(99L)).thenReturn(Optional.empty());
        assertThat(guildService.getGuild(99L)).isEmpty();
    }
}
