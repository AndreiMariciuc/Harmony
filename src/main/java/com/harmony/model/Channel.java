package com.harmony.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
public class Channel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonBackReference
    private ChannelCategory category;

    @OneToOne
    private ChannelType type;

    private String name;

    @OneToMany(mappedBy = "channel")
    @ToString.Exclude
    private Set<Message> messages = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if(!(o instanceof Channel channel)) return false;
        if (this == o) return true;
        if (Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        return Objects.equals(id, channel.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
