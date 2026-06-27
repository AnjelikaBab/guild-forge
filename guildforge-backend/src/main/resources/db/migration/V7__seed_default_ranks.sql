-- Default rank ladders for each fixed guild (Guild Masters can extend via API).
INSERT INTO ranks (guild_id, name, threshold)
SELECT g.id,
    r.name,
    r.threshold
FROM guilds g
    CROSS JOIN (
        VALUES ('Newcomer', 0),
            ('Apprentice', 5),
            ('Expert', 20),
            ('Master', 50)
    ) AS r (name, threshold)
WHERE g.name IN (
        'Cooking',
        'Fitness',
        'Reading',
        'Gaming',
        'Crocheting'
    );
