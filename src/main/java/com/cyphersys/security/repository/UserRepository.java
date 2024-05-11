package com.cyphersys.security.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cyphersys.security.model.Role;
import com.cyphersys.security.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>{
    public Optional<User> findByUsername(String username);

    public boolean existsByUsername(String username);
    public boolean existsByRoles(Role role);
    public void deleteByUsername(String username);

}
