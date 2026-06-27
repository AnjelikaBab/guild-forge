package com.guildforge.dsl;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;

class ParserTest {

    @Test
    void respectsOperatorPrecedence() {
        List<Token> tokens = new Lexer("1 + 2 * 3").tokenize();
        ASTNode ast = new Parser(tokens).parseExpression();
        assertThat(ast)
                .isInstanceOfSatisfying(
                        ASTNode.Binary.class,
                        b -> {
                            assertThat(b.op()).isEqualTo(Token.TokenType.PLUS);
                            assertThat(b.left()).isEqualTo(new ASTNode.Literal(1L));
                            assertThat(b.right()).isInstanceOfSatisfying(
                                    ASTNode.Binary.class,
                                    inner -> {
                                        assertThat(inner.op()).isEqualTo(Token.TokenType.STAR);
                                        assertThat(inner.left()).isEqualTo(new ASTNode.Literal(2L));
                                        assertThat(inner.right()).isEqualTo(new ASTNode.Literal(3L));
                                    });
                        });
    }

    @Test
    void parsesComparisonAndVariable() {
        List<Token> tokens = new Lexer("points >= 100").tokenize();
        ASTNode ast = new Parser(tokens).parseExpression();
        Interpreter interpreter = new Interpreter();
        Object value = interpreter.evaluate(ast, Map.of("points", 150));
        assertThat(((Number) value).doubleValue()).isEqualTo(1.0);
    }
}
