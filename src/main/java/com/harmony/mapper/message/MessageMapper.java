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

        return messageDto;
    }

    public static Message defaultReverseMapping(MessageDto messageDto) {
        var message = new Message();
        message.setId(messageDto.getId());
        message.setToGuild(messageDto.isToGuild());
        message.setSender(UserMapper.defaultReverseMapping(messageDto.getSender()));
        message.setReceiver(UserMapper.defaultReverseMapping(messageDto.getReceiver()));
        // TODO: channel
        message.setMessage(messageDto.getMessage());

        return message;
    }
}
