package com.cyphersys.security.wire.request;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserRequest {

    @JsonProperty(required = true)
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @JsonProperty(required = true)
    private Set<String> roles;

    @JsonProperty
    @Size(min = 6, max = 40)
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    @JsonIgnore
    public void setPassword(String password) {
        this.password = password;
    }

    public Set<String> getRoles() {
        return this.roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

}
