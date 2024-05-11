package com.cyphersys.security.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cyphersys.security.model.Role;
import java.util.Optional;


public interface RoleRepository extends JpaRepository<Role, Long> {
    public Optional<Role> findByName(String name);
}
