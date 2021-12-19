package com.harmony.mapper.message;

import com.harmony.dto.MessageDto;
import com.harmony.mapper.user.UserMapper;
import com.harmony.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.servlet.ServletContext;

@Component
public class MessageMapper {
    private static String serverDomain;

    @Autowired
    public void setServerDomain( @Value("${server.domain}") String serverDomain) {
        MessageMapper.serverDomain = serverDomain;
    }

    public static MessageDto defaultMapping(Message message) {
        var messageDto = new MessageDto();
        messageDto.setId(message.getId());
        messageDto.setToGuild(message.isToGuild());
        messageDto.setSender(UserMapper.defaultMapping(message.getSender()));
        messageDto.setReceiver(UserMapper.defaultMapping(message.getReceiver()));
        if (message.getChannel() != null)
            messageDto.setChannelId(message.getChannel().getId());
        messageDto.setMessage(message.getMessage());
        messageDto.setDate(message.getDate());
        if (message.getImageUrl() != null)
            messageDto.setImageUrl(serverDomain + message.getImageUrl());
        return messageDto;
    }

    public static Message sendMessageReverseMapping(MessageDto messageDto) {
        Message message = new Message();
        message.setDate(messageDto.getDate());
        message.setMessage(messageDto.getMessage());
        message.setImageUrl(messageDto.getImageUrl());
        return message;
    }

    public static Message defaultReverseMapping(MessageDto messageDto) {
        var message = new Message();
        message.setId(messageDto.getId());
        message.setToGuild(messageDto.isToGuild());
        message.setSender(UserMapper.defaultReverseMapping(messageDto.getSender()));
        message.setReceiver(UserMapper.defaultReverseMapping(messageDto.getReceiver()));
        // TODO: channel
        message.setMessage(messageDto.getMessage());
        message.setDate(messageDto.getDate());

        return message;
    }
}
