package com.jasonqiu.springbootreactdemo.repository;

import org.apache.ibatis.annotations.*;

import com.jasonqiu.springbootreactdemo.entity.UserInfo;

@Mapper
public interface UserInfoRepository {


    @Select("select * from user_info.user where username = #{username}")
    @Results(id = "UserInfoList", value = {
        @Result(property = "id", column = "id", id = true),
        @Result(property = "username", column = "username"),
        @Result(property = "nickname", column = "nickname"),
        @Result(property = "password", column = "password"),
        @Result(property = "status", column = "status"),
        @Result(property = "email", column = "email"),
        @Result(property = "mobile", column = "mobile"),
        @Result(property = "gender", column = "gender"),
        @Result(property = "avatar", column = "avatar"),
        @Result(property = "userType", column = "user_type"),
        @Result(property = "createBy", column = "create_by"),
        @Result(property = "createTime", column = "create_time"),
        @Result(property = "updateBy", column = "update_by"),
        @Result(property = "updateTime", column = "update_time"),
        @Result(property = "deleteFlag", column = "delete_flag")
    })
    UserInfo findByUsername(String username);
    
    
}
