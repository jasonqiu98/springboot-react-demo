package com.jasonqiu.springbootreactdemo.entity;

import java.io.Serializable;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfo implements Serializable {
    private static final long serialVersionUID = -40356785423868312L;

    private Long id;
    private String username;
    private String nickname;
    private String password;
    
    /**
     * account status (0 normal, 1 suspended)
     */
    private String status;

    private String email;
    private String mobile;
    
    /**
     * gender (0 female, 1 male, 2 others)
     */
    private String gender;

    private String avatar;

    /**
     * user type (0 admin, 1 normal)
     */
    private String userType;

    /**
     * id of the admin that creates the record
     */
    private Long createBy;

    /**
     * time when created
     */

    private Date createTime;

    /**
     * id of the admin that updates the record
     */
    private Long updateBy;

    /**
     * time when updated
     */
    private Date updateTime;

    /**
     * a delete flag (0 not deleted, 1 deleted)
     */
    private Integer deleteFlag;

}
