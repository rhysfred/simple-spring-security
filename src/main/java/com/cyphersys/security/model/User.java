package com.cyphersys.security.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.cyphersys.security.wire.response.UserResponse;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "USERS", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username") })
public class User {
    private static final Logger logger = LoggerFactory.getLogger(User.class);

    @Id
    @GeneratedValue
    private Long id;

    @NotBlank
    @JsonProperty(required = true)
    @Column(nullable = false, unique = true)
    private String username;

    @NotBlank
    @JsonProperty(required = true)
    @Column(nullable = false, unique = true)
    private String externalId;

    @JsonIgnore
    @NotBlank
    private String hashedPassword;

    @ManyToMany
    private List<Role> roles;

    @SuppressWarnings("unused")
    private User() {}

    public User(String username, String password) {
        this.username = username;
        this.hashedPassword = password;
        this.roles = new ArrayList<Role>();
        this.externalId = UUID.randomUUID().toString();

    }

    public void setPassword(String hashedPassword) {
        this.hashedPassword = hashedPassword;
    }

    public Long getId() {
        return this.id;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getExternalId() {
        return this.externalId;
    }

    public String getPassword() {
        return this.hashedPassword;
    }

    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    public Boolean removeRole(Role role) {
        return roles.remove(role);
    }

    public void addRole(Role role) {
        if (!roles.contains(role)) {
            roles.add(role);
        } else {
            logger.error("Attempt to remove role that user does not have. No action taken");
        }
    }

    public Boolean hasRole(Role role) {
        logger.debug("hasRole called");
        logger.debug("Returning {} for hasRole", roles.contains(role));
        return roles.contains(role);
    }

    
    public UserResponse toUserResponse() {
        return new UserResponse(this.username, this.externalId, this.roles);
    }

}
