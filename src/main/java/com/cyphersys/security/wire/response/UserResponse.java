package com.cyphersys.security.wire.response;
import java.util.ArrayList;
import java.util.List;


import com.cyphersys.security.model.Role;
import com.fasterxml.jackson.annotation.JsonProperty;

public class UserResponse {

    @JsonProperty(required = true)
    private String username;

    @JsonProperty(required = true)
    private String id;

    @JsonProperty(required = true)
    private List<String> roles;

    public UserResponse() {
        this.roles = new ArrayList<String>();
    }

    public UserResponse(String username, String id, List<Role> roles) {
        this.roles = new ArrayList<String>();
        this.username = username;
        this.id = id;
        for (Role role : roles) {
            this.roles.add(role.getName());
        }
    }

    public String getUsername() {
        return this.username;
    }

    public List<String> getRoles() {
        return roles;
    }

    public String getId() {
        return id;
    }
}
