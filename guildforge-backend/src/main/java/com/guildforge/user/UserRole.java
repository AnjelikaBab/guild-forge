package com.guildforge.user;

public enum UserRole {
    ADMIN,
    GUILD_MASTER,
    MEMBER;

    public String authority() {
        return "ROLE_" + name();
    }
}
