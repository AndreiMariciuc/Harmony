package com.harmony.controller;

import com.harmony.dto.ResponseDto;
import com.harmony.dto.UserDto;
import com.harmony.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.apache.commons.validator.routines.EmailValidator;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/")
public class AccountRestController {
    private final UserService userService;

    @Autowired
    public AccountRestController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseDto register(@RequestBody UserDto user) {
        List<String> errors = new ArrayList<>();
        UserDto newUser = null;
        boolean hasError = false;

        user.setUsername(user.getUsername().trim());
        user.setPassword(user.getPassword().trim());
        user.setEmail(user.getEmail().trim());

        var emptyUsername = user.getUsername().isBlank();
        if(emptyUsername) {
            errors.add("Username is empty.");
            hasError = true;
        } else {
            if(user.getUsername().length() < 4) {
                errors.add("Username must be at least 4 characters long");
                hasError = true;
            } else {
                var byName = userService.findByName(user.getUsername());
                if(byName != null) {
                    errors.add("Username already exists.");
                    hasError = true;
                }
            }
        }

        var emptyPassword = user.getPassword().isBlank();
        if(emptyPassword) {
            errors.add("Password is empty.");
            hasError = true;
        } else {
            if(user.getPassword().length() < 4) {
                errors.add("Password must be at least 4 characters long");
                hasError = true;
            }
        }

        var emptyEmail = user.getEmail().isBlank();
        if(emptyEmail) {
            errors.add("Email is empty.");
            hasError = true;
        } else {
            var validEmail = EmailValidator.getInstance().isValid(user.getEmail());
            if(!validEmail) {
                errors.add("Email is not valid.");
                hasError = true;
            } else {
                var byEmail = userService.findByEmail(user.getEmail());
                if(byEmail != null) {
                    errors.add("Email already taken.");
                    hasError = true;
                }
            }
        }

        if(hasError) {
            return new ResponseDto(errors, null);
        }

        try {
            userService.save(user);
            newUser = userService.findByNameAndPassword(user);
        } catch (Exception e) {
            errors.add(e.getMessage());
        }

        return new ResponseDto(errors.size() > 0 ? errors : null, newUser);
    }

    @PostMapping("/login")
    public ResponseDto signIn(@RequestBody UserDto user) {
        List<String> errors = new ArrayList<>();
        UserDto byNameAndPassword = null;
        boolean hasError = false;

        user.setUsername(user.getUsername().trim());
        user.setPassword(user.getPassword().trim());

        var emptyUsername = user.getUsername().isBlank();
        if(emptyUsername) {
            errors.add("Username is empty.");
            hasError = true;
        } else {
            if(user.getUsername().length() < 4) {
                errors.add("Username must be at least 4 characters long");
                hasError = true;
            }
        }

        var emptyPassword = user.getPassword().isBlank();
        if(emptyPassword) {
            errors.add("Password is empty.");
            hasError = true;
        } else {
            if(user.getPassword().length() < 4) {
                errors.add("Password must be at least 4 characters long");
                hasError = true;
            }
        }

        if(hasError) {
            return new ResponseDto(errors, null);
        }

        try {
            byNameAndPassword = userService.findByNameAndPassword(user);
        } catch (Exception e) {
            errors.add(e.getMessage());
        }

        return new ResponseDto(errors.size() > 0 ? errors : null, byNameAndPassword);
    }
}
