package com.jasonqiu.springbootreactdemo.security.repository;

import org.apache.ibatis.annotations.*;

import com.jasonqiu.springbootreactdemo.security.entity.UserInfo;


@Mapper
public interface UserInfoRepository {


    @Select("select * from user_info.user where username = #{username}")
    @Results(id = "UserInfoList", value = {
        @Result(property = "id", column = "id", id = true),
        @Result(property = "username", column = "username"),
        @Result(property = "password", column = "password"),
        @Result(property = "firstName", column = "first_name"),
        @Result(property = "lastName", column = "last_name"),
        @Result(property = "email", column = "email"),
        @Result(property = "role", column = "role"),
        @Result(property = "enabled", column = "enabled"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "modifiedAt", column = "modified_at"),
        @Result(property = "deleteFlag", column = "delete_flag")
    })
    UserInfo findByUsername(String username);

    @Select("select * from user_info.user where id = #{id}")
    @ResultMap("UserInfoList")
    UserInfo findById(Long id);

    @Select("select * from user_info.user where email = #{email}")
    @ResultMap("UserInfoList")
    UserInfo findByEmail(String email);
    
    @Insert({
        "insert into user_info.user",
        "(username, password, email, first_name, last_name, role, enabled, created_at)",
        "values (#{username}, #{password}, #{email}, #{firstName}, ",
        "#{lastName}, #{role}, #{enabled}, #{createdAt})"
    })
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void save(UserInfo user);

    @Update("update user_info.user set enabled = 1, modified_at = now() where id = #{userId}")
    void enableUser(Long userId);

    @Update("update user_info.user set enabled = -1, modified_at = now() where id = #{userId}")
    void disableUser(Long userId);

    @Select("select enabled from user_info.user where id = #{userId}")
    Integer enabled(Long userId);

    @Update("update user_info.user set password = #{newPassword}, modified_at = now() where id = #{userId}")
    void changePassword(Long userId, String newPassword);

    @Select("select email from user_info.user where username = #{username}")
    String findEmailByUsername(String username);

    @Update("update user_info.user set role = #{role} where username = #{username}")
    void changeRoleByUsername(String username, Integer role);

    @Update("update user_info.user set role = #{role} where email = #{email}")
    void changeRoleByEmail(String email, Integer role);

    @Select("select id from user_info.user where username = #{username}")
    Long findIdByUsername(String username);

    @Select("select id from user_info.user where email = #{email}")
    Long findIdByEmail(String email);
}
