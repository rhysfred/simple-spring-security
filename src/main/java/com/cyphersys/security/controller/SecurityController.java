package com.cyphersys.security.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cyphersys.security.SimpleUserDetails;
import com.cyphersys.security.jwt.JwtUtils;
import com.cyphersys.security.model.Role;
import com.cyphersys.security.model.User;
import com.cyphersys.security.repository.RoleRepository;
import com.cyphersys.security.repository.UserRepository;
import com.cyphersys.security.wire.request.ChangePasswordRequest;
import com.cyphersys.security.wire.request.UserRequest;
import com.cyphersys.security.wire.request.LoginRequest;
import com.cyphersys.security.wire.request.PriveligedChangePasswordRequest;
import com.cyphersys.security.wire.response.JwtResponse;
import com.cyphersys.security.wire.response.SecurityStatusReponse;
import com.cyphersys.security.wire.response.UserResponse;

import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/security")
public class SecurityController {
    private static final Logger logger = LoggerFactory.getLogger(SecurityController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder encoder;

    @Value("${com.cyphersys.security.defaults.admin.name:}")
    private String defaultAdmin;

    @Value("${com.cyphersys.security.defaults.admin.password:}")
    private String defaultAdminPw;

    @Value("${com.cyphersys.security.defaults.admin.role:}")
    private String defaultAdminRoleName;

    @Value("${com.cyphersys.security.defaults.roles:}")
    private String defaultRoles;

    @Value("${com.cyphersys.security.defaults.secadmin.password:}")
    private String secadminPw;

    @PostConstruct
    private void initDB() {
        if (roleRepository.count() == 0) {
            ArrayList<Role> roles = new ArrayList<Role>();
            if (!defaultRoles.trim().isEmpty()) {
                String[] roleNames = defaultRoles.split(",\\s*");
                for (int i = 0; i < roleNames.length; i++) {
                    Role defaultRole = new Role(roleNames[i]);
                    defaultRole = roleRepository.save(defaultRole);
                    roles.add(defaultRole);
                }
            } else {
                logger.info("Security DB initialised with no roles created");
                return;
            }
            createAdminUser("secadmin", "secadmin",
                    (secadminPw.trim().isEmpty() ? generatePassword("secadmin") : secadminPw), true);
            createAdminUser(defaultAdmin, defaultAdminRoleName, defaultAdminPw, false);

        } else {
            logger.info("Security DB previously initialised. No action taken");
        }
    }

    public Boolean createAdminUser(String adminName, String adminRoleName, String adminPw, Boolean secadmin) {
        if (!adminRoleName.trim().isEmpty()) {
            Role adminRole = new Role(adminRoleName);
            adminRole = roleRepository.save(adminRole);
            if (!adminName.trim().isEmpty() && !adminPw.trim().isEmpty()) {
                User adminUser = new User(adminName, encoder.encode(adminPw));
                if (!secadmin) {
                    adminUser.setRoles(roleRepository.findAll());
                }
                adminUser.addRole(adminRole);
                userRepository.save(adminUser);
                return true;
            } else {
                logger.info("No {} user created", secadmin ? "secadmin" : "admin");
                return false;
            }
        } else {
            logger.info("Security DB initialised with no {} role created", secadmin ? "secadmin" : "admin");
            return false;
        }
    }

    public String generatePassword(String user) {
        int len = 12;
        String AB = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!*$%@";
        Random rnd = new Random();
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(AB.charAt(rnd.nextInt(AB.length())));
        }
        logger.info("Generated password for " + user + " is " + sb.toString());
        return sb.toString();
    }

    @PostMapping("/public/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
                        loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        SimpleUserDetails userDetails = (SimpleUserDetails) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                roles));
    }

    @GetMapping("/secure/token")
    public ResponseEntity<?> refreshToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String jwt = jwtUtils.generateJwtToken(authentication);

        SimpleUserDetails userDetails = (SimpleUserDetails) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                roles));
    }

    @PostMapping("/secure/changepassword")
    public ResponseEntity<?> changePassword(Principal principal,
            @Valid @RequestBody ChangePasswordRequest changePasswordRequest) {
        Optional<User> oUser = userRepository.findByUsername(principal.getName());
        if (oUser.isPresent()) {
            User user = oUser.get();
            if (encoder.matches(changePasswordRequest.getPassword(), user.getPassword())) {
                String newPassword = encoder.encode(changePasswordRequest.getNewPassword());
                user.setPassword(newPassword);
                user = userRepository.save(user);
                logger.info("Password changed for " + principal.getName());
                return ResponseEntity.ok().body("{}");
            } else {
                logger.error("Received a bad current password when changing password for " + principal.getName());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new SecurityStatusReponse(HttpStatus.UNAUTHORIZED, "Bad password"));
            }
        } else {
            logger.error("Failed to find matching DB user for principal " + principal.getName());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new SecurityStatusReponse(HttpStatus.UNAUTHORIZED, "User no longer exists"));
        }
    }

    @PostMapping("/admin/changepassword")
    public ResponseEntity<?> changePasswordPriveliged(Principal principal,
            @Valid @RequestBody PriveligedChangePasswordRequest changePasswordRequest) {
        Optional<User> oUser = userRepository.findByUsername(changePasswordRequest.getUsername());
        if (oUser.isPresent()) {
            User user = oUser.get();
            String newPassword = encoder.encode(changePasswordRequest.getNewPassword());
            user.setPassword(newPassword);
            user = userRepository.save(user);
            logger.info("Password changed for " + changePasswordRequest.getUsername());
            return ResponseEntity.ok().body("{}");
        } else {
            logger.error("Failed to find matching DB user per request " + changePasswordRequest.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new SecurityStatusReponse(HttpStatus.UNAUTHORIZED, "User does not exist"));
        }
    }

    @PostMapping("/admin/user")
    public ResponseEntity<?> createUser(@Valid @RequestBody UserRequest createUserRequest) {
        if (createUserRequest.getPassword() == null) {
            logger.error("Null password received when creating user: " + createUserRequest.getUsername());
            return ResponseEntity
                    .badRequest()
                    .body(new SecurityStatusReponse(HttpStatus.BAD_REQUEST, "Cannot create user with null password"));
        }
        if (userRepository.existsByUsername(createUserRequest.getUsername())) {
            logger.error("Username already in use: " + createUserRequest.getUsername());
            return ResponseEntity
                    .badRequest().body(new SecurityStatusReponse(HttpStatus.BAD_REQUEST, "Username already in use"));
        }
        User user = new User(createUserRequest.getUsername(),
                encoder.encode(createUserRequest.getPassword()));

        Set<String> strRoles = createUserRequest.getRoles();

        if (strRoles != null) {
            strRoles.forEach(role -> {
                Optional<Role> odbRole = roleRepository.findByName(role);
                if (odbRole.isPresent()) {
                    Role dbRole = odbRole.get();
                    user.addRole(dbRole);
                } else {
                    logger.error("Invalid role received when creating user: " + createUserRequest.getUsername()
                            + ", role: " + role);
                }
            });
        }
        userRepository.save(user);
        logger.info("New user created: " + createUserRequest.getUsername());
        return ResponseEntity.ok(user.getUserResponse());
    }

    @GetMapping("/admin/users")
    public ResponseEntity<?> getUsers() {
        List<User> users = userRepository.findAll();
        List<UserResponse> userResults = new ArrayList<UserResponse>();
        for (User dbuser : users) {
            UserResponse user = dbuser.getUserResponse();
            userResults.add(user);
        }
        return ResponseEntity
                .ok(userResults);
    }

    @DeleteMapping("/admin/user/{username}")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable String username) {
        if (userRepository.existsByUsername(username)) {
            userRepository.deleteByUsername(username);
            logger.info("User successfully deleted: " + username);
            return ResponseEntity
                    .ok("{}");
        }
        logger.error("Request to delete user that does not exist: " + username);
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/admin/user/{username}")
    public ResponseEntity<?> updateUser(@PathVariable String username,
            @Valid @RequestBody UserRequest editUserRequest) {
        Optional<User> oUser = userRepository.findByUsername(username);
        if (oUser.isPresent()) {
            User updatedUser = oUser.get();
            List<Role> roles = new ArrayList<Role>();
            for (String role : editUserRequest.getRoles()) {
                Optional<Role> oRole = roleRepository.findByName(role);
                if (oRole.isPresent()) {
                    roles.add(oRole.get());
                } else {
                    logger.error("Invalid role received when creating user: " + username + ", role: " + role);
                    return ResponseEntity.badRequest().body("{reason: 'Invalid role specified'}");
                }
            }
            updatedUser.setRoles(roles);
            updatedUser.setUsername(editUserRequest.getUsername());
            if (editUserRequest.getPassword() != null) {
                updatedUser.setPassword(encoder.encode(editUserRequest.getPassword()));
            }
            userRepository.save(updatedUser);
            logger.info("User successfully updated: " + username);
            return ResponseEntity
                    .ok(updatedUser.getUserResponse());
        }
        logger.error("Request to update user that does not exist: " + username);
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/admin/roles")
    public ResponseEntity<?> getRoles() {
        List<Role> roles = roleRepository.findAll();
        List<String> roleResults = new ArrayList<String>();
        for (Role dbrole : roles) {
            roleResults.add(dbrole.getName());
        }
        return ResponseEntity
                .ok(roleResults);
    }

}
