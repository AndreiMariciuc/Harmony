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
@Table(uniqueConstraints={@UniqueConstraint(columnNames={"username", "email"})})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username")
    private String username;

    private String password;

    @Column(name = "email")
    private String email;

    private Byte[] image;

    private String description;

    @OneToMany(mappedBy = "user")
    @ToString.Exclude
    private Set<UserGuild> userGuilds = new HashSet<>();

    @OneToMany(mappedBy = "sender")
    @ToString.Exclude
    private Set<MessageRequest> sendRequests = new HashSet<>();

    @OneToMany(mappedBy = "receiver")
    @ToString.Exclude
    private Set<MessageRequest> receiveRequests = new HashSet<>();

    @OneToMany(mappedBy = "sender")
    @ToString.Exclude
    private Set<Message> sentMessages = new HashSet<>();

    @OneToMany(mappedBy = "receiver")
    @ToString.Exclude
    private Set<Message> receivedMessages = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if(!(o instanceof User user)) return false;
        if (this == o) return true;
        if (Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getEmail());
    }
}
