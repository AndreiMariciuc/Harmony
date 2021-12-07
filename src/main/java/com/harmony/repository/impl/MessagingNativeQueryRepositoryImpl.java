package com.harmony.repository.impl;

import com.harmony.mapper.message.MessageMapper;
import com.harmony.model.Message;
import com.harmony.repository.MessagingNativeQueryRepository;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class MessagingNativeQueryRepositoryImpl implements MessagingNativeQueryRepository {
    @PersistenceContext
    private EntityManager entityManager;


    @Override
    public List<Message> getPrivateMessages(Long user1Id, Long user2Id, int startMessageIndex, int pageSize) {
        Query query = entityManager.createQuery("SELECT msg FROM Message msg " +
                "WHERE msg.toGuild = false AND " +
                "(msg.receiver.id = :user1Id AND msg.sender.id = :user2Id OR msg.receiver.id = :user2Id AND msg.sender.id = :user1Id) " +
                "ORDER BY msg.id DESC", Message.class);

        query.setFirstResult(startMessageIndex);
        query.setMaxResults(pageSize);

        query.setParameter("user1Id", user1Id);
        query.setParameter("user2Id", user2Id);


        System.out.println(query.getParameters());
        System.out.println(query.getResultList());

        return query.getResultList();
//        return null;
    }
}
