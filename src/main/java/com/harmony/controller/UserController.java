package com.harmony.controller;

import com.harmony.dto.UserDto;
import com.harmony.exception.user.UserNotFoundException;
import com.harmony.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public String getHomeClient(@PathVariable("id") Long id, Model model) {
        UserDto byId;
        try {
            byId = userService.findById(id);
        } catch (UserNotFoundException e) {
            return "404";
        }

        model.addAttribute("user", byId);

        return "client";
    }
}
