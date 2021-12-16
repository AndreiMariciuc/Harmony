package com.harmony.service.impl;

import com.harmony.dto.GuildDto;
import com.harmony.mapper.guild.GuildMapper;
import com.harmony.model.Guild;
import com.harmony.repository.GuildRepository;
import com.harmony.service.GuildService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GuildServiceImpl implements GuildService {
    private final GuildRepository guildRepository;

    @Autowired
    public GuildServiceImpl(GuildRepository guildRepository) {
        this.guildRepository = guildRepository;
    }

    @Override
    public List<GuildDto> findForUser(Long id) {
        List<Guild> guilds = guildRepository.findForUser(id);

        if (guilds == null) return null;

        return guilds.stream().
                map(GuildMapper::defaultMapping)
                .collect(Collectors.toList());

    }
}
