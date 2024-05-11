package com.cyphersys.security.wire.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;

public class PriveligedChangePasswordRequest {

    @JsonProperty(required = true)
    @NotBlank
    private String username;

    @JsonProperty(required = true)
    @NotBlank
    private String newPassword;

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String password) {
        this.newPassword = password;
    }

    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
}