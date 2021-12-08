package com.harmony.controller;

import com.harmony.dto.ResponseDto;
import com.harmony.service.GuildService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/guilds")
public class GuildRestController {
    private final GuildService guildService;

    @Autowired
    public GuildRestController(GuildService guildService) {
        this.guildService = guildService;
    }

    @GetMapping("/{userId}")
    public ResponseDto getGuilds(@PathVariable("userId") Long userId) {
        String error = null;
        Object data = guildService.findForUser(userId);
        return new ResponseDto(error, data);
    }
}
