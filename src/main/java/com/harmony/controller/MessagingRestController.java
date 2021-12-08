package com.harmony.controller;

import com.harmony.dto.MessageDto;
import com.harmony.dto.ResponseDto;
import com.harmony.mapper.message.MessageMapper;
import com.harmony.model.Message;
import com.harmony.service.MessageRequestService;
import com.harmony.service.MessagingService;
import com.harmony.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessagingRestController {
    private final UserService userService;
    private final MessageRequestService messageRequestService;
    private final MessagingService messagingService;

    @Autowired
    public MessagingRestController(UserService userService, MessageRequestService messageRequestService, MessagingService messagingService) {
        this.userService = userService;
        this.messageRequestService = messageRequestService;
        this.messagingService = messagingService;
    }

    @GetMapping("/{user1Id}/@me/{user2Id}")
    public ResponseDto getPrivateMessages(@PathVariable Long user1Id, @PathVariable Long user2Id,
                                          @RequestParam(defaultValue = "0") Integer startMessageIndex) {
        String error = null;
        List data = null;

        try {
            data = messagingService.getPrivateMessages(user1Id, user2Id, startMessageIndex);
        } catch (Exception e) {
            error = e.getMessage();
        }

        return new ResponseDto(error, data);
    }

    @PostMapping("/{user1Id}/@me/{user2Id}")
    public ResponseDto sendPrivateMessages(@PathVariable Long user1Id, @PathVariable Long user2Id,
                                           @RequestBody MessageDto messageDto) {
        String error = null;
        MessageDto frontendMessage = null;

        System.out.println(messageDto.getMessage());

        try {
            Message message = MessageMapper.sendMessageReverseMapping(messageDto);
            frontendMessage = MessageMapper.defaultMapping(messagingService.sendPrivateMessage(user1Id, user2Id, message));
        } catch (Exception e) {
            error = e.getMessage();
        }

        return new ResponseDto(error, frontendMessage);
    }

    @GetMapping("/{userId}/{guildId}/{channelId}")
    public ResponseDto getGuildMessages(@PathVariable Long userId, @PathVariable Long guildId,
                                        @PathVariable Long channelId) {
        String error = null;

        try {

        } catch (Exception e) {
            error = e.getMessage();
        }

        return new ResponseDto(error, null);
    }
}
