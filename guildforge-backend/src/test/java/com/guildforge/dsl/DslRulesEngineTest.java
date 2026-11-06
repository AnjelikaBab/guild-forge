package com.guildforge.dsl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.Map;
import org.junit.jupiter.api.Test;

class DslRulesEngineTest {

    private final DslRulesEngine engine = new DslRulesEngine();

    private static final String RULES =
            """
            Master: logs >= 50
            Expert: logs >= 20
            Apprentice: logs >= 5
            Newcomer: logs >= 0
            """;

    @Test
    void picksFirstMatchingRule() {
        assertThat(engine.resolveRank(RULES, Map.of("logs", 50L))).isEqualTo("Master");
        assertThat(engine.resolveRank(RULES, Map.of("logs", 20L))).isEqualTo("Expert");
        assertThat(engine.resolveRank(RULES, Map.of("logs", 5L))).isEqualTo("Apprentice");
        assertThat(engine.resolveRank(RULES, Map.of("logs", 0L))).isEqualTo("Newcomer");
    }

    @Test
    void skipsCommentsAndBlankLines() {
        String rules =
                """
                # cooking ladder
                Chef: logs >= 10

                Cook: logs >= 0
                """;
        assertThat(engine.resolveRank(rules, Map.of("logs", 12L))).isEqualTo("Chef");
    }

    @Test
    void rejectsMalformedLines() {
        assertThatThrownBy(() -> engine.parseRules("not a rule"))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
