package com.harmony.controller;

import com.harmony.dto.ResponseDto;
import com.harmony.dto.UserDto;
import com.harmony.service.MessageRequestService;
import com.harmony.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserRestController {
    private final UserService userService;
    private final MessageRequestService messageRequestService;

    @Autowired
    public UserRestController(UserService userService, MessageRequestService messageRequestService) {
        this.userService = userService;
        this.messageRequestService = messageRequestService;
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

    @GetMapping("/all")
    public List<UserDto> getAllUsers(@RequestParam(value = "id", defaultValue = "-1") Long id,
                                     @RequestParam(defaultValue = "") String likeUser) {
        return userService.findAllUsers(id, likeUser);
    }

    @GetMapping("/{id}/requests")
    public List<UserDto> getAllRequests(@PathVariable(value = "id") Long id) {
        return userService.findPendingRequests(id);
    }

    @DeleteMapping("/reject")
    public ResponseDto rejectRequest(@RequestParam("receiverId") Long receiverId,
                                     @RequestParam("senderId") Long senderId) {
        String error = null;

        try {
            messageRequestService.rejectRequest(receiverId, senderId);
        } catch (Exception e) {
            error = e.getMessage();
        }

        return new ResponseDto(error, null);
    }

    @GetMapping("/friends")
    public ResponseDto getAllFriends(@RequestParam Long id) {
        return new ResponseDto(null, userService.findFriends(id));
    }
}
