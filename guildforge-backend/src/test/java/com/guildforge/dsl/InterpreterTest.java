package com.guildforge.dsl;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;

class InterpreterTest {

    @Test
    void evaluatesMixedArithmeticAndLogic() {
        List<Token> tokens = new Lexer("(5 + 3) * 2 > 10 AND !0").tokenize();
        ASTNode ast = new Parser(tokens).parseExpression();
        Interpreter interpreter = new Interpreter();
        assertThat(interpreter.evaluateBoolean(ast, Map.of())).isTrue();
    }

    @Test
    void substitutesVariables() {
        List<Token> tokens = new Lexer("score * 2 + bonus >= 100").tokenize();
        ASTNode ast = new Parser(tokens).parseExpression();
        Interpreter interpreter = new Interpreter();
        assertThat(interpreter.evaluateBoolean(
                        ast,
                        Map.of(
                                "score", 40,
                                "bonus", 15)))
                .isFalse();
        assertThat(interpreter.evaluateBoolean(
                        ast,
                        Map.of(
                                "score", 40,
                                "bonus", 20)))
                .isTrue();
    }
}
