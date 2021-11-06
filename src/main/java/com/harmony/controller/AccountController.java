package com.harmony.controller;

import com.harmony.dto.AccountDto;
import com.harmony.dto.UserDto;
import com.harmony.exception.user.UserRegisterException;
import com.harmony.exception.user.UserSignInException;
import com.harmony.model.User;
import com.harmony.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/")
public class AccountController {
    private final UserService userService;

    @Autowired
    public AccountController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public String getHome() {
        return "home";
    }

    @GetMapping("/register")
    public String getRegister(Model model) {
        /// De ce?
        model.addAttribute("registerForm", new User());
        return "register";
    }

    @PostMapping("/register")
    @ResponseBody
    public AccountDto register(@RequestBody UserDto user) {
        try {
            userService.save(user);
        } catch (UserRegisterException e) {
            return new AccountDto(e.getMessage());
        }

        return new AccountDto();
    }

    @GetMapping("/sign-in")
    public String getSignIn() {
        return "sign-in";
    }

    @PostMapping("/sign-in")
    @ResponseBody
    public AccountDto signIn(@RequestBody UserDto user, HttpSession session) {
        UserDto byNameAndPassword;
        try {
            byNameAndPassword = userService.findByNameAndPassword(user);
            session.setAttribute("userId", byNameAndPassword.getId());
        } catch (UserSignInException e) {
            return new AccountDto(e.getMessage());
        }

        return new AccountDto();
    }
}
