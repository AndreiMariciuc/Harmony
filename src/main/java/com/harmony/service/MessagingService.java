package com.harmony.service;

import com.harmony.dto.MessageDto;
import com.harmony.model.Message;

import java.util.List;

public interface MessagingService {
    List<MessageDto> getPrivateMessages(Long user1Id, Long user2Id);

    List<MessageDto> getPrivateMessages(Long user1Id, Long user2Id, int startMessageIndex);

    Message sendPrivateMessage(Long senderId, Long receiverId, Message msg) throws Exception;
}
