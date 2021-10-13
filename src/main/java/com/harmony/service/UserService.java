package com.harmony.service;

import com.harmony.exception.UserRegisterException;
import com.harmony.exception.UserSignInException;
import com.harmony.model.User;

import java.util.Optional;

public interface UserService {
    User save(User user) throws UserRegisterException;

    User findByNameAndPassword(User user) throws UserSignInException;

}
