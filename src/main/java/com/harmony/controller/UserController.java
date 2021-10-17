package com.harmony.controller;

import com.harmony.dto.UserDto;
import com.harmony.exception.user.UserNotFoundException;
import com.harmony.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public String getHomeClient(Model model, HttpSession session) {
        UserDto byId;
        try {
            Long id = (Long) session.getAttribute("userId");
            byId = userService.findById(id);
        } catch (UserNotFoundException e) {
            /// N-ar fi mai bine la login daca nu exista id?
            return "404";
        }

        model.addAttribute("user", byId);

        return "client";
    }
}
