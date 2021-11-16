package com.harmony.repository;

import com.harmony.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends CrudRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.password = :password AND u.username = :username")
    User findUserByNameAndPassword(@Param("username") String username,
                                   @Param("password") String password);

    @Query("SELECT u FROM User u WHERE u.id <> :id AND u.username LIKE CONCAT('%', :likeUser, '%')" +
            "AND NOT EXISTS (FROM MessageRequest msreq WHERE msreq.sender.id = :id AND msreq.receiver.id = u.id" +
            " or msreq.receiver.id = :id AND msreq.sender.id = u.id)")
    List<User> findAllUsers(@Param("id") Long id, @Param("likeUser") String likeUser);

    @Query("SELECT msreq.sender FROM  User u LEFT JOIN MessageRequest msreq ON u.id = msreq.receiver.id " +
            "WHERE u.id = :id AND msreq.accepted = false")
    List<User> findPendingRequests(@Param("id") Long id);

    @Query("SELECT msreq.sender FROM User u LEFT JOIN MessageRequest msreq ON u.id = msreq.receiver.id" +
            "WHERE u.id = :id AND msreq.accepted = true")
    List<User> findSenderFriends(@Param("id") Long id);

    @Query("SELECT msreq.receiver from User LEFT JOIN MessageRequest msreq ON u.id = msreq.sender.id" +
            "WHERE u.id = :id AND msreq.accepted = true")
    List<User> findReceiverFriends(@Param("id") Long id);
}
