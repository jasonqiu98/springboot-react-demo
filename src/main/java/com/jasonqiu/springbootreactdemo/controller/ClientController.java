package com.jasonqiu.springbootreactdemo.controller;

import com.jasonqiu.springbootreactdemo.entity.Client;
import com.jasonqiu.springbootreactdemo.service.ClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/clients")
public class ClientController {

    final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping("/name/{firstName}/{lastName}")
    public String printClientInfo(@PathVariable("firstName") String firstName,
                                  @PathVariable("lastName") String lastName) {
        Client clientInfo = clientService.getClientByName(firstName, lastName);
        return "Hello " + clientInfo.getFirstName() + " " + clientInfo.getLastName() +
                ", your email is " + clientInfo.getEmail();
        // // A neat but **slower** alternative, as concat uses StringBuilder as an optimization
        // String outputFormat = "Hello %s %s, your email is %s";
        // return String.format(outputFormat, clientInfo.getFirstName(), clientInfo.getLastName(),
        // clientInfo.getEmail());
    }

    @GetMapping
    public List<Client> getClients() {
        return clientService.getClients();
    }

    @GetMapping("/id/{id}")
    public Client getClient(@PathVariable Long id) {
        return clientService.getClient(id);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createClient(@RequestBody Client client) throws URISyntaxException {
        if (null != clientService.getClientByEmail(client.getEmail())) {
            return ResponseEntity.badRequest().body("The record with the same name and email already exists");
        } else {
            clientService.createClient(client);
            // use client.getId() to get the auto-generated key
            // https://github.com/mybatis/mybatis-3/wiki/FAQ#how-can-i-retrieve-the-value-of-an-auto-generated-key
            return ResponseEntity.created(new URI("/clients/" + client.getId())).body(client);
        }
    }

    @PutMapping("/update/{id}")
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
    public ResponseEntity<String> deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.ok("The record with id " + id + " is deleted");
    }

}
