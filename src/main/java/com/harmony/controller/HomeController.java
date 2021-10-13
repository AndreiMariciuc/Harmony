package com.harmony.controller;

import com.harmony.exception.UserRegisterException;
import com.harmony.exception.UserSignInException;
import com.harmony.model.User;
import com.harmony.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.function.EntityResponse;

@Controller
@RequestMapping("/")
public class HomeController {
    private final UserService userService;

    @Autowired
    public HomeController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public String getHome() {
        return "home";
    }

    @GetMapping("/register")
    public String getRegister(Model model) {
        model.addAttribute("registerForm", new User());
        return "register";
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        User saved = null;

        try {
            saved = userService.save(user);
        } catch (UserRegisterException e) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE)
                    .body(e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(saved);
    }

    @GetMapping("/sign-in")
    public String getSignIn() {
        return "sign-in";
    }

    @PostMapping("/sign-in")
    public ResponseEntity<?> signIn(@RequestBody User user) {
        try {
            userService.findByNameAndPassword(user);
        } catch (UserSignInException e) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT)
                    .body(e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(user);
    }
}
