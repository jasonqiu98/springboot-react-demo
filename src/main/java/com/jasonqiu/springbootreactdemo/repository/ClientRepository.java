package com.jasonqiu.springbootreactdemo.repository;

import com.jasonqiu.springbootreactdemo.entity.Client;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ClientRepository {

    @Select("select * from client.client offset #{offset} limit #{limit}")
    @Results(id = "ClientList", value = {
            @Result(property = "id", column = "id", id = true),
            @Result(property = "firstName", column = "first_name"),
            @Result(property = "lastName", column = "last_name"),
            @Result(property = "email", column = "email"),
            @Result(property = "gender", column = "gender")
    })
    List<Client> findAll(int offset, int limit);

    @Select("select * from client.client where id = #{id}")
    @ResultMap("ClientList")
    // @ResultMap(value = {"ClientList"})
    Client findById(Long id);

    @Select("select * from client.client where first_name = #{firstName} and last_name = #{lastName}")
    @ResultMap("ClientList")
    Client findByName(String firstName, String lastName);

    @Select("select * from client.client where email = #{email}")
    @ResultMap("ClientList")
    Client findByEmail(String email);

    @Insert({
        "insert into client.client (first_name, last_name, email, gender)",
        "values (#{firstName}, #{lastName}, #{email}, #{gender})"
    })
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void save(Client client);

    @Update({
        "update client.client",
        "set first_name = #{client.firstName}, last_name = #{client.lastName}, ",
        "email = #{client.email}, gender = #{client.gender}",
        "where id = #{id}"
    })
    @Options(useGeneratedKeys = true, keyProperty = "client.id")
    void updateById(Long id, Client client);

    @Delete("delete from client.client where id = #{id}")
    void deleteById(Long id);
}
