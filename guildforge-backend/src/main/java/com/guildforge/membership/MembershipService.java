package com.guildforge.membership;

import com.guildforge.guild.Guild;
import com.guildforge.guild.GuildRepository;
import com.guildforge.user.User;
import com.guildforge.user.UserRepository;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class MembershipService {

    private final MembershipRepository membershipRepository;
    private final UserRepository userRepository;
    private final GuildRepository guildRepository;
    private final MembershipRankService membershipRankService;

    public MembershipService(
            MembershipRepository membershipRepository,
            UserRepository userRepository,
            GuildRepository guildRepository,
            MembershipRankService membershipRankService) {
        this.membershipRepository = membershipRepository;
        this.userRepository = userRepository;
        this.guildRepository = guildRepository;
        this.membershipRankService = membershipRankService;
    }

    @Transactional
    public Map<String, Object> join(String username, Long guildId) {
        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Guild guild = guildRepository.findById(guildId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (membershipRepository.findByUser_IdAndGuild_Id(user.getId(), guildId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already a member");
        }
        Membership m = new Membership();
        m.setUser(user);
        m.setGuild(guild);
        m = membershipRepository.save(m);
        membershipRankService.recalculateRankForMember(user.getId(), guildId);
        Map<String, Object> out = new HashMap<>();
        out.put("id", m.getId());
        out.put("userId", user.getId());
        out.put("guildId", guild.getId());
        out.put("rank", m.getRank());
        out.put("joinedAt", m.getJoinedAt().toString());
        return out;
    }

    @Transactional
    public void leave(String username, Long guildId) {
        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        Membership m = membershipRepository
                .findByUser_IdAndGuild_Id(user.getId(), guildId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not a member"));
        membershipRepository.delete(m);
    }
}
