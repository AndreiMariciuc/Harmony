package com.harmony.model;

import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Guild {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Byte[] image;

    private String description;

    @OneToMany(mappedBy = "guild")
    @ToString.Exclude
    private Set<UserGuild> userGuilds = new HashSet<>();

    @OneToMany(mappedBy = "guild")
    @ToString.Exclude
    private Set<ChannelCategory> categories = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Guild guild = (Guild) o;
        return Objects.equals(id, guild.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
