package com.harmony.repository;

import com.harmony.model.MessageRequest;
import org.springframework.data.repository.CrudRepository;

public interface GuildRepository extends CrudRepository<MessageRequest, Long> {
}
