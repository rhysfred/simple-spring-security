package com.cyphersys.security;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Objects;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.cyphersys.security.model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class SimpleUserDetails implements UserDetails {
    private static final long serialVersionUID = 1L;

    private Long id;

    private String externalId;

    private String username;

    @JsonIgnore
    private String password;

    private Collection<? extends GrantedAuthority> authorities;

    public SimpleUserDetails(Long id, String externalId, String username, String password,
            Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.externalId = externalId;
        this.username = username;
        this.password = password;
        this.authorities = authorities;
    }
    public static SimpleUserDetails build(User user) {
    List<GrantedAuthority> authorities = user.getRoles().stream()
        .map(role -> new SimpleGrantedAuthority(role.getName()))
        .collect(Collectors.toList());

    return new SimpleUserDetails(
        user.getId(), 
        user.getExternalId(),
        user.getUsername(), 
        user.getPassword(), 
        authorities);
  }
  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return authorities;
  }

  public Long getId() {
    return id;
  }

  public String getExternalId() {
    return externalId;
  }

  @Override
  public String getPassword() {
    return password;
  }

  @Override
  public String getUsername() {
    return username;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    SimpleUserDetails user = (SimpleUserDetails) o;
    return Objects.equals(id, user.id);
  }


}
