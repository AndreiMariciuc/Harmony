package com.harmony.service;

import com.harmony.dto.UserDto;
import com.harmony.exception.user.UserNotFoundException;
import com.harmony.exception.user.UserRegisterException;
import com.harmony.exception.user.UserSignInException;

public interface UserService {
    void save(UserDto user) throws UserRegisterException;

    UserDto findByNameAndPassword(UserDto user) throws UserSignInException;

    UserDto findById(Long id) throws UserNotFoundException;
}
