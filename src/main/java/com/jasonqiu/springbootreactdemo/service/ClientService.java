package com.jasonqiu.springbootreactdemo.service;

import com.jasonqiu.springbootreactdemo.entity.Client;

import java.util.List;

public interface ClientService {


    List<Client> getClients();

    List<Client> getClients(int offset, int limit);

    Client getClient(Long id);

    Client getClientByName(String name);

    Client getClientByNameAndEmail(String name, String email);

    void createClient(Client client);

    void updateClient(Long id, Client client);

    void deleteClient(Long id);
}
