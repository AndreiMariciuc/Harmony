package com.harmony.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
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

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date date;
}
