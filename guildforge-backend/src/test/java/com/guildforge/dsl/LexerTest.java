package com.guildforge.dsl;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.Test;

class LexerTest {

    @Test
    void tokenizesArithmeticAndKeywords() {
        List<Token> tokens = new Lexer("1 + 2 * (x - 3) AND foo == 42 OR NOT bar").tokenize();
        assertThat(tokens.stream().map(Token::type).toList())
                .containsExactly(
                        Token.TokenType.NUMBER,
                        Token.TokenType.PLUS,
                        Token.TokenType.NUMBER,
                        Token.TokenType.STAR,
                        Token.TokenType.LPAREN,
                        Token.TokenType.IDENT,
                        Token.TokenType.MINUS,
                        Token.TokenType.NUMBER,
                        Token.TokenType.RPAREN,
                        Token.TokenType.AND,
                        Token.TokenType.IDENT,
                        Token.TokenType.EQ,
                        Token.TokenType.NUMBER,
                        Token.TokenType.OR,
                        Token.TokenType.NOT,
                        Token.TokenType.IDENT,
                        Token.TokenType.EOF);
    }
}
