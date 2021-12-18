package com.harmony.mapper.message;

import com.harmony.dto.MessageDto;
import com.harmony.mapper.user.UserMapper;
import com.harmony.model.Message;

public class MessageMapper {
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
        messageDto.setImageUrl(message.getImageUrl());

        return messageDto;
    }

    public static Message sendMessageReverseMapping(MessageDto messageDto) {
        Message message = new Message();
        message.setDate(messageDto.getDate());
        message.setMessage(messageDto.getMessage());
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
