package com.harmony.repository;

import com.harmony.model.Guild;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GuildRepository extends CrudRepository<Guild, Long> {
    @Query("SELECT g from Guild g JOIN UserGuild ug ON g.id = ug.guild.id AND ug.user.id = :id")
    List<Guild> findForUser(@Param("id") Long id);
}
