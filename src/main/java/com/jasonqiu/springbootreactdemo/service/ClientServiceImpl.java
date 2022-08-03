package com.jasonqiu.springbootreactdemo.service;

import com.jasonqiu.springbootreactdemo.entity.Client;
import com.jasonqiu.springbootreactdemo.repository.ClientRepository;
import org.springframework.stereotype.Service;
import org.postgresql.util.PSQLException;

import java.util.List;

@Service
public class ClientServiceImpl implements ClientService {

    final ClientRepository clientRepository;

    public ClientServiceImpl(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @Override
    public List<Client> getClients() {
        return getClients(0, 5);
    }

    @Override
    public List<Client> getClients(int offset, int limit) {
        return clientRepository.findAll(offset, limit);
    }

    @Override
    public Client getClient(Long id) {
        return clientRepository.findById(id);
    }

    @Override
    public Client getClientByName(String name) {
        return clientRepository.findByName(name);
    }

    public Client getClientByNameAndEmail(String name, String email) {
        return clientRepository.findByNameAndEmail(name, email);
    }

    @Override
    public void createClient(Client client) {
        clientRepository.save(client);
    }

    @Override
    public void updateClient(Long id, Client client) {
        clientRepository.updateById(id, client);
    }

    @Override
    public void deleteClient(Long id) {
        clientRepository.deleteById(id);
    }
}
