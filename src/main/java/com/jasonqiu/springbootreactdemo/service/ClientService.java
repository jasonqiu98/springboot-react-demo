package com.jasonqiu.springbootreactdemo.service;

import com.jasonqiu.springbootreactdemo.entity.Client;

import java.util.List;

public interface ClientService {

    List<Client> getClients();

    Integer getLength();

    List<Client> getClients(Integer offset, Integer limit);

    Client getClient(Long id);

    List<Client> getClientByName(String firstName, String lastName);

    Client getClientByEmail(String email);

    void createClient(Client client);

    void updateClient(Long id, Client client);

    void deleteClient(Long id);
}
