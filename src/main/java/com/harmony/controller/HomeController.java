package com.harmony.controller;

import com.harmony.model.User;
import com.harmony.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("")
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
    public String getRegister(@RequestBody User user) {
        System.out.println(user);
        userService.save(user);
        return "redirect:/";
    }
}
