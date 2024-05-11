package com.cyphersys.security.wire.response;

import org.springframework.http.HttpStatus;

public class SecurityStatusReponse {
    private HttpStatus status;
    private String reason;

    public SecurityStatusReponse() {}

    public SecurityStatusReponse(HttpStatus status, String reason) {
        this.status = status;
        this.reason = reason;
    }
    public HttpStatus getStatus() {
        return status;
    }
    public void setStatus(HttpStatus status) {
        this.status = status;
    }
    public String getReason() {
        return reason;
    }
    public void setReason(String reason) {
        this.reason = reason;
    }

    
}
