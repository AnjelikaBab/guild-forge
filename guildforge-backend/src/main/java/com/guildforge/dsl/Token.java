package com.guildforge.dsl;

public record Token(TokenType type, String lexeme, Object literal) {

    public enum TokenType {
        NUMBER,
        IDENT,
        PLUS,
        MINUS,
        STAR,
        SLASH,
        EQ,
        NE,
        LT,
        LE,
        GT,
        GE,
        AND,
        OR,
        NOT,
        LPAREN,
        RPAREN,
        COMMA,
        EOF
    }
}
