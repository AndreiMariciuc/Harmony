package com.harmony.repository;

import com.harmony.model.MessageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface MessageRequestRepository extends CrudRepository<MessageRequest, Long> {
    @Query("SELECT msreq FROM MessageRequest msreq " +
            "WHERE msreq.receiver.id = :receiverId AND msreq.sender.id = :senderId")
    MessageRequest getRequestByIds(@Param("receiverId") Long receiverId,
                                   @Param("senderId") Long senderId);
}
