-- Five platform guilds (fixed set). owner_id NULL until a Guild Master is assigned.
INSERT INTO guilds (name, theme, description, dsl_rules, owner_id)
VALUES (
        'Cooking',
        'cooking',
        'Log meals you cook and share techniques with fellow home chefs.',
        NULL,
        NULL
    ),
    (
        'Fitness',
        'fitness',
        'Log workouts, runs, and training sessions.',
        NULL,
        NULL
    ),
    (
        'Reading',
        'reading',
        'Log books and reading sessions; track pages and titles.',
        NULL,
        NULL
    ),
    (
        'Gaming',
        'gaming',
        'Log gaming sessions, wins, and co-op time.',
        NULL,
        NULL
    ),
    (
        'Crocheting',
        'crocheting',
        'Log projects, patterns, and yarn craft progress.',
        NULL,
        NULL
    );
