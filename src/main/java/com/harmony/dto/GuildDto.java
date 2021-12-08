package com.harmony.dto;

import com.harmony.model.ChannelCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GuildDto {
    private Long id;
    private String name;
    private String description;
    private Set<ChannelCategory> categories;
}
