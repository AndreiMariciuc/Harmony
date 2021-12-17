package com.harmony.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

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
    private String imageUrl;
    private Date date;
}
