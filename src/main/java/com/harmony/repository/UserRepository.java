package com.harmony.repository;

import com.harmony.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.password = :password AND u.username = :username")
    User findUserByNameAndPassword(@Param("username") String username,
                                   @Param("password") String password);
}
