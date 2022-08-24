package com.jasonqiu.springbootreactdemo.controller;

import com.jasonqiu.springbootreactdemo.entity.Client;
import com.jasonqiu.springbootreactdemo.security.service.UserInfoService;
import com.jasonqiu.springbootreactdemo.service.ClientService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;
    private final UserInfoService userInfoService;

    @GetMapping("/hello")
    @PreAuthorize("hasAuthority('client')")
    public ResponseEntity<String> printClientInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = (String) authentication.getPrincipal();
        String email = userInfoService.getEmailByUsername(username);
        if (null == email) {
            return ResponseEntity.ok().body("Hello guest! Welcome to our Client List.");
        }

        Client client = clientService.getClientByEmail(email);

        if (null == client) {
            return ResponseEntity.ok().body("Hello guest! Welcome to our Client List.");
        }

        return ResponseEntity.ok().body("Hello " + client.getFirstName() + " " +
                client.getLastName() + "! Welcome to our Client List.");
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('admin', 'user')")
    public List<Client> getClients() {
        return clientService.getClients();
    }

    @GetMapping("/id/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'user')")
    public Client getClient(@PathVariable Long id) {
        return clientService.getClient(id);
    }

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> createClient(@RequestBody Client client) throws URISyntaxException {
        if (null != clientService.getClientByEmail(client.getEmail())) {
            return ResponseEntity.badRequest().body("The email already exists");
        } else {
            clientService.createClient(client);
            // use client.getId() to get the auto-generated key
            // https://github.com/mybatis/mybatis-3/wiki/FAQ#how-can-i-retrieve-the-value-of-an-auto-generated-key
            return ResponseEntity.created(new URI("/clients/" + client.getId())).body(client);
        }
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> updateClient(@PathVariable Long id, @RequestBody Client client) {
        client.setId(id);
        Client currentClient = clientService.getClient(id);
        if (null == currentClient) {
            return ResponseEntity.badRequest().body("The record with id " + id + " does not exist");
        } else if (currentClient.equals(client)) {
            // return without any operation
            return ResponseEntity.ok(client);
        } else if (null != clientService.getClientByEmail(client.getEmail())) {
            return ResponseEntity.badRequest().body("The record with the same name and email already exists");
        } else {
            clientService.updateClient(id, client);
            // use client.getId() to automatically update the key
            // same as above
            return ResponseEntity.ok(client);
        }
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<String> deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.ok("The record with id " + id + " is deleted");
    }

}
