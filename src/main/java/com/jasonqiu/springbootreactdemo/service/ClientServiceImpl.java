package com.jasonqiu.springbootreactdemo.service;

import com.jasonqiu.springbootreactdemo.entity.Client;
import com.jasonqiu.springbootreactdemo.repository.ClientRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;

    @Override
    public List<Client> getClients() {
        return clientRepository.findAllClients();
    }

    @Override
    public Integer getLength() {
        return clientRepository.count();
    }

    @Override
    public List<Client> getClients(Integer offset, Integer limit) {
        return clientRepository.findAll(offset, limit);
    }

    @Override
    public Client getClient(Long id) {
        return clientRepository.findById(id);
    }

    @Override
    public List<Client> getClientByName(String firstName, String lastName) {
        return clientRepository.findByName(firstName, lastName);
    }

    public Client getClientByEmail(String email) {
        return clientRepository.findByEmail(email);
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
