package com.harmony.mapper.user;

import com.harmony.dto.UserDto;
import com.harmony.model.User;

public class UserMapper {
    public static UserDto defaultMapping(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setPassword(user.getPassword());
        userDto.setEmail(user.getEmail());
        userDto.setDescription(user.getDescription());

        return userDto;
    }

    public static User defaultReverseMapping(UserDto userDto) {
        User user = new User();
        user.setId(userDto.getId());
        user.setUsername(userDto.getUsername());
        user.setPassword(userDto.getPassword());
        user.setEmail(userDto.getEmail());
        user.setDescription(userDto.getDescription());

        return user;
    }
}
