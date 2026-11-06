package com.guildforge.dsl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/** Rank rules: one {@code RankName: expression} per line; first match wins. */
public class DslRulesEngine {

    private final Interpreter interpreter = new Interpreter();

    public record RankRule(String rankName, ASTNode condition) {}

    public List<RankRule> parseRules(String source) {
        List<RankRule> rules = new ArrayList<>();
        if (source == null || source.isBlank()) {
            return rules;
        }
        String[] lines = source.split("\\R");
        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].trim();
            if (line.isEmpty() || line.startsWith("#")) {
                continue;
            }
            int colon = line.indexOf(':');
            if (colon <= 0 || colon == line.length() - 1) {
                throw new IllegalArgumentException("Invalid rule on line " + (i + 1) + ": expected RankName: expression");
            }
            String name = line.substring(0, colon).trim();
            String expr = line.substring(colon + 1).trim();
            if (name.isEmpty() || expr.isEmpty()) {
                throw new IllegalArgumentException("Invalid rule on line " + (i + 1) + ": empty name or expression");
            }
            ASTNode condition = new Parser(new Lexer(expr).tokenize()).parseExpression();
            rules.add(new RankRule(name, condition));
        }
        return rules;
    }

    public String resolveRank(String source, Map<String, Number> variables) {
        for (RankRule rule : parseRules(source)) {
            if (interpreter.evaluateBoolean(rule.condition(), variables)) {
                return rule.rankName();
            }
        }
        return null;
    }
}
