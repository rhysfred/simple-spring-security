package com.cyphersys.security.wire.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;

public class ChangePasswordRequest {

    @NotBlank
    @JsonProperty(required = true)
    private String password;

    @NotBlank
    @JsonProperty(required = true)
    private String newPassword;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String password) {
        this.newPassword = password;
    }
}