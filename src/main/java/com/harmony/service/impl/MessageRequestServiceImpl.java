package com.harmony.service.impl;

import com.harmony.exception.message.RequestNotFoundException;
import com.harmony.repository.MessageRequestRepository;
import com.harmony.service.MessageRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MessageRequestServiceImpl implements MessageRequestService {
    private final MessageRequestRepository messageRequestRepository;

    @Autowired
    public MessageRequestServiceImpl(MessageRequestRepository messageRequestRepository) {
        this.messageRequestRepository = messageRequestRepository;
    }

    @Override
    public void rejectRequest(Long receiverId, Long senderId) throws RequestNotFoundException {
        var request = messageRequestRepository.getRequestByIds(receiverId, senderId);
        if(request == null) throw new RequestNotFoundException("Request not found!");
        messageRequestRepository.delete(request);
    }

    @Override
    public void acceptRequest(Long receiverId, Long senderId) throws Exception {
        var request = messageRequestRepository.getRequestByIds(receiverId, senderId);
        request.setAccepted(true);
        messageRequestRepository.save(request);
    }
}
