package com.harmony.service;

import com.harmony.dto.GuildDto;

import java.util.List;

public interface GuildService {
    List<GuildDto> findForUser(Long id);
}
