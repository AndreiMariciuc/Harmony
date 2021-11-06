package com.harmony.controller;

import com.harmony.dto.ResponseDto;
import com.harmony.dto.UserDto;
import com.harmony.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        String error = null;
        UserDto newUser = null;

        try {
            userService.save(user);
            newUser = userService.findByNameAndPassword(user);
        } catch (Exception e) {
            error = e.getMessage();
        }

        return new ResponseDto(error, newUser);
    }

    @PostMapping("/login")
    public ResponseDto signIn(@RequestBody UserDto user) {
        String error = null;
        UserDto byNameAndPassword = null;

        try {
            byNameAndPassword = userService.findByNameAndPassword(user);
        } catch (Exception e) {
            error = e.getMessage();
        }

        return new ResponseDto(error, byNameAndPassword);
    }
}
