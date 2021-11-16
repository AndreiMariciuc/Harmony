package com.harmony.service;

public interface MessageRequestService {
    void rejectRequest(Long receiverId, Long senderId) throws Exception;
    void acceptRequest(Long receiverId, Long senderId) throws Exception;
}
