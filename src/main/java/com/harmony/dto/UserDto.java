package com.harmony.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;


@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class UserDto {
    private Long id;

    private String username;

    private String password;

    private String email;

    //asta poate schimbam!?!
    //private Byte[] image;

    private String description;
}
