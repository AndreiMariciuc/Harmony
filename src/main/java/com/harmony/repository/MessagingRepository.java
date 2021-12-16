package com.harmony.repository;

import com.harmony.model.Message;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessagingRepository extends PagingAndSortingRepository<Message, Long> {
//    @Query("SELECT msg FROM Message msg " +
//            "WHERE msg.toGuild = false AND " +
//            "(msg.receiver.id = :user1Id AND msg.sender.id = :user2Id OR msg.receiver.id = :user2Id AND msg.sender.id = :user1Id) " +
//            "ORDER BY msg.id DESC")
//    List<Message> getPrivateMessages(@Param("user1Id") Long user1Id,
//                                     @Param("user2Id") Long user2Id,
//                                     Pageable pageable)
}
