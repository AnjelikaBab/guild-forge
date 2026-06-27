package com.guildforge.membership;

import com.guildforge.user.UserRepository;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/memberships")
public class MembershipController {

    private final MembershipService membershipService;

    public MembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }

    @PostMapping("/guild/{guildId}/join")
    public Map<String, Object> join(@PathVariable Long guildId, Authentication auth) {
        requireUser(auth);
        return membershipService.join(auth.getName(), guildId);
    }

    @DeleteMapping("/guild/{guildId}/leave")
    public void leave(@PathVariable Long guildId, Authentication auth) {
        requireUser(auth);
        membershipService.leave(auth.getName(), guildId);
    }

    private void requireUser(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
    }
}
