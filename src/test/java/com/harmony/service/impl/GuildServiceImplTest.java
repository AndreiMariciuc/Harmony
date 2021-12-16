package com.harmony.service.impl;

import com.harmony.model.*;
import com.harmony.repository.*;
import com.harmony.service.GuildService;
import org.hibernate.SessionFactory;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceContext;

@SpringBootTest
class GuildServiceImplTest {
    @Autowired
    private GuildService guildService;

    @Autowired
    private ChannelRepository channelRepository;

    @Autowired
    private ChannelCategoryRepository channelCategoryRepository;

    @Autowired
    private ChannelTypeRepository channelTypeRepository;

    @Autowired
    private GuildRepository guildRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserGuildRepository userGuildRepository;

    private SessionFactory sessionFactory;

    @Autowired
    private EntityManagerFactory entityManagerFactory;


    private static Guild guild;
    private static User user;//admin
    private static UserGuild userGuild;
    private static ChannelCategory channelCategory;
    private static Channel channel1, channel2;
    private static ChannelType channelType;

    @BeforeEach
    void setUp() {
        sessionFactory = entityManagerFactory.unwrap(SessionFactory.class);

        guild = new Guild();
        guild.setDescription("This is a test Guild");
        guild.setName("Test Guild");
        sessionFactory.getCurrentSession().update(guild);

        channelCategory = new ChannelCategory();
        channelCategory.setName("Test category channel");
        channelCategory.setGuild(guild);
//        channelCategoryRepository.save);
        sessionFactory.getCurrentSession().update(channelCategory);

        channelType = new ChannelType();
        channelType.setName("VOICE");
//        channelTypeRepository.save(channelType);
        sessionFactory.getCurrentSession().update(channelType);


        channel1 = new Channel();
        channel1.setType(channelType);
        channel1.setName("new channel1");
        channel1.setCategory(channelCategory);


        channel2 = new Channel();
        channel2.setName("new channel2");
        channel2.setType(channelType);
        channel2.setCategory(channelCategory);

        sessionFactory.getCurrentSession().update(channel1);
        sessionFactory.getCurrentSession().update(channel2);

//        channelRepository.save();
//        channelRepository.save(channel2);


        user = new User();
        user.setUsername("andreiTest");
        user.setPassword("andreiTest");
        user.setEmail("andreiTest@test.com");
//        userRepository.save(user);
        sessionFactory.getCurrentSession().update(user);


        userGuild = new UserGuild();
        userGuild.setGuild(guild);
        userGuild.setUser(user);
//        userGuildRepository.save(userGuild);
        sessionFactory.getCurrentSession().update(userGuild);

    }

    @Test
    void getGuild() {
        Assertions.assertTrue(guildService.findForUser(user.getId()).contains(guild));
        Assertions.assertEquals(1, guildService.findForUser(user.getId()).size());
    }
}