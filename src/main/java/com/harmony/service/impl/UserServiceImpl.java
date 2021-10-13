package com.harmony.service.impl;

import com.harmony.exception.UserRegisterException;
import com.harmony.exception.UserSignInException;
import com.harmony.model.User;
import com.harmony.repository.UserRepository;
import com.harmony.service.UserService;
import org.hibernate.HibernateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User save(User user) throws UserRegisterException {
        User saved;

        try {
             saved = userRepository.save(user);
        } catch (HibernateException e) {
            throw new UserRegisterException("You can not use this username or email");
        }

        return saved;
    }

    @Override
    public User findByNameAndPassword(User user) throws UserSignInException {
        User userByNameAndPassword = userRepository.findUserByNameAndPassword(user.getUsername(), user.getPassword());

        if (userByNameAndPassword == null)
            throw new UserSignInException("username or password wrong!\n Try again!");

        return user;
    }
}
