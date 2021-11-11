package com.harmony.service.impl;

import com.harmony.dto.UserDto;
import com.harmony.exception.user.UserNotFoundException;
import com.harmony.exception.user.UserRegisterException;
import com.harmony.exception.user.UserSignInException;
import com.harmony.mapper.user.UserMapper;
import com.harmony.model.User;
import com.harmony.repository.UserRepository;
import com.harmony.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void save(UserDto user) throws UserRegisterException {
        try {
            userRepository.save(UserMapper.defaultReverseMapping(user));
        } catch (RuntimeException e) {
            throw new UserRegisterException("You can not use this username or email");
        }
    }

    @Override
    public UserDto findByNameAndPassword(UserDto user) throws UserSignInException {
        User userByNameAndPassword = userRepository.findUserByNameAndPassword(user.getUsername(), user.getPassword());

        if (userByNameAndPassword == null)
            throw new UserSignInException("username or password wrong!\n Try again!");

        return UserMapper.defaultMapping(userByNameAndPassword);
    }

    @Override
    public UserDto findById(Long id) throws UserNotFoundException {
        Optional<User> byId = userRepository.findById(id);

        if (byId.isEmpty()) {
            throw new UserNotFoundException("User not found!");
        }

        return UserMapper.defaultMapping(byId.get());
    }

    @Override
    public List<UserDto> findAllUsers(Long id, String likeUser) {
        return userRepository.findAllUsers(id, likeUser).stream()
                .map(UserMapper::defaultMapping)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDto> findPendingRequests(Long id) {
        return userRepository.findPendingRequests(id).stream()
                .map(UserMapper::defaultMapping)
                .collect(Collectors.toList());
    }
}
