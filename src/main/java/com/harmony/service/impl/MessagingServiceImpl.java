package com.harmony.service.impl;

import com.harmony.model.Message;
import com.harmony.repository.MessagingNativeQueryRepository;
import com.harmony.repository.MessagingRepository;
import com.harmony.repository.UserRepository;
import com.harmony.service.MessagingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessagingServiceImpl implements MessagingService {
    private final UserRepository userRepository;
    private final MessagingRepository messagingRepository;
    private final MessagingNativeQueryRepository messagingNativeQueryRepository;

    @Autowired
    public MessagingServiceImpl(UserRepository userRepository, MessagingRepository messagingRepository, MessagingNativeQueryRepository messagingNativeQueryRepository) {
        this.userRepository = userRepository;
        this.messagingRepository = messagingRepository;
        this.messagingNativeQueryRepository = messagingNativeQueryRepository;
    }

    @Override
    public List<Message> getPrivateMessages(Long user1Id, Long user2Id) {
        return getPrivateMessages(user1Id, user2Id, 0);
    }

    @Override
    public List<Message> getPrivateMessages(Long user1Id, Long user2Id, int startMessageIndex) {
        return messagingNativeQueryRepository.getPrivateMessages(user1Id, user2Id, startMessageIndex, 20);
    }

    @Override
    public Message sendPrivateMessage(Long senderId, Long receiverId, String msg) throws Exception {
        var sender = userRepository.findById(senderId).orElse(null);
        var receiver = userRepository.findById(receiverId).orElse(null);

        if(sender == null || receiver == null) {
            throw new Exception("A specified does not exist!");
        }
        var message = new Message(null, false, sender, receiver, null, msg);
        System.out.println(message);
        message = messagingRepository.save(message);
        System.out.println(message);
        return message;
    }
}
