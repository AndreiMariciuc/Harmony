package com.harmony.mapper.guild;

import com.harmony.dto.GuildDto;
import com.harmony.model.Guild;

public class GuildMapper {
    public static GuildDto defaultMapping(Guild guild) {
        GuildDto guildDto = new GuildDto();
        guildDto.setId(guild.getId());
        guildDto.setName(guild.getName());
        guildDto.setDescription(guild.getDescription());
        guildDto.setCategories(guild.getCategories());
        return guildDto;
    }
}
