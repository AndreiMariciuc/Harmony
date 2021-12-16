INSERT INTO user (email, password, username)
VALUES ('email@utcn.ro', 'admin', 'admin'), ('email1@utcn.ro', 'admin1', 'admin1');

INSERT INTO channel_type (name)
VALUES ('VOICE'), ('CALL'), ('TEXT');

INSERT INTO guild (description, name)
VALUES ('This is a test guild', 'test guild');

INSERT INTO channel_category (name, guild_id)
VALUES ('new category test', 1), ('another category test', 1);

INSERT INTO channel (name, category_id, type_id)
VALUES ('weird text channel', 1, 3), (' another weird text channel', 1, 3);

INSERT INTO user_guild (guild_id, user_id) VALUES (1, 1)


