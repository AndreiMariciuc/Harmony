package com.harmony.service;

import com.harmony.dto.UserDto;
import com.harmony.exception.user.UserNotFoundException;
import com.harmony.exception.user.UserRegisterException;
import com.harmony.exception.user.UserSignInException;

import java.util.List;

public interface UserService {
    void save(UserDto user) throws UserRegisterException;

    UserDto findByNameAndPassword(UserDto user) throws UserSignInException;

    UserDto findById(Long id) throws UserNotFoundException;

    List<UserDto> findAllUsers(Long id, String likeUser);

    List<UserDto> findPendingRequests(Long id);

    List<UserDto> findFriends(Long id);

    void sendFriendRequest(Long senderId, Long receiverId) throws Exception;
}
