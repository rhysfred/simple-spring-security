package com.cyphersys.security;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.cyphersys.security.model.User;
import com.cyphersys.security.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Service
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {
    
  @Autowired
  UserRepository userRepository;

  @Override
  @Transactional
  public org.springframework.security.core.userdetails.UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

    return UserDetails.build(user);
  }
}