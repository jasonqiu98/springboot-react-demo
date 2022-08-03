package com.jasonqiu.springbootreactdemo.repository;


import com.jasonqiu.springbootreactdemo.entity.Client;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ClientRepository {

    @Select("select * from client.client offset #{offset} limit #{limit}")
    List<Client> findAll(int offset, int limit);

    @Select("select * from client.client where id = #{id}")
    Client findById(Long id);

    @Select("select * from client.client where name = #{clientName}")
    Client findByName(String clientName);

    @Select("select * from client.client where name = #{clientName} and email = #{clientEmail}")
    Client findByNameAndEmail(String clientName, String clientEmail);

    @Insert("insert into client.client (name, email) values (#{name}, #{email})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void save(Client client);

    @Update("update client.client set name = #{client.name}, email = #{client.email} where id = #{id}")
    @Options(useGeneratedKeys = true, keyProperty = "client.id")
    void updateById(Long id, Client client);

    @Delete("delete from client.client where id = #{id}")
    void deleteById(Long id);
}
