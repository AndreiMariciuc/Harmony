package com.harmony.controller;

import com.harmony.dto.ResponseDto;
import com.harmony.dto.UserDto;
import com.harmony.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserRestController {
    private final UserService userService;

    @Autowired
    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseDto register(@PathVariable("id") Long id) {
        String error = null;
        UserDto user = null;

        try {
            user = userService.findById(id);
        } catch (Exception e) {
            error = e.getMessage();
        }

        return new ResponseDto(error, user);
    }
}
