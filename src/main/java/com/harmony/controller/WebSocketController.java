package com.harmony.controller;

import com.harmony.dto.UserDto;
import com.harmony.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;

@RestController
public class WebSocketController {
    private final UserService userService;

    @Autowired
    public WebSocketController(UserService userService) {
        this.userService = userService;
    }

    @MessageMapping("/user-info")
    @SendToUser("/topic/user-info")
    public UserDto test(SimpMessageHeaderAccessor headerAccessor) {
        var session = (HttpSession) headerAccessor.getSessionAttributes().get("session");
        var userId = (Long) session.getAttribute("userId");
        System.out.println(session.getAttribute("userId"));
        System.out.println("merge");

        try {
            return userService.findById(userId);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }
}
