package com.harmony.service;

import com.harmony.model.Message;

import java.util.List;

public interface MessagingService {
    List<Message> getPrivateMessages(Long user1Id, Long user2Id);
    List<Message> getPrivateMessages(Long user1Id, Long user2Id, int startMessageIndex);
    Message sendPrivateMessage(Long senderId, Long receiverId, String msg) throws Exception;
}
