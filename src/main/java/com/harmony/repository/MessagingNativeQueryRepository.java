package com.harmony.repository;

import com.harmony.model.Message;

import java.util.List;

public interface MessagingNativeQueryRepository {
    List<Message> getPrivateMessages(Long user1Id, Long user2Id, int startMessageIndex, int pageSize);
}
