package com.cyphersys.security.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "ROLES", uniqueConstraints = {
        @UniqueConstraint(columnNames = "name") })
public class Role {

    @Id
    @GeneratedValue
    @JsonIgnore
    private Long id;

    @JsonProperty(required = true)
    private String name;

    public Role() {}
    public Role(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o.getClass() == this.getClass()) {
            Role otherRole = (Role) o;
            if (this.getName().equals(otherRole.getName())) {
                return true;
            }
        }
        return false;
    }  
}
