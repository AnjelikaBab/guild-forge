UPDATE guilds
SET dsl_rules = E'Master: logs >= 50\nExpert: logs >= 20\nApprentice: logs >= 5\nNewcomer: logs >= 0'
WHERE dsl_rules IS NULL
    OR btrim(dsl_rules) = '';
