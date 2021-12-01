package com.harmony.dto;

import com.harmony.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageDto {
    private Long id;

    private boolean toGuild;

    private UserDto sender;
    private UserDto receiver;

    private Long channelId;

    private String message;
}
