package com.jasonqiu.springbootreactdemo.security.entity;

import java.io.Serializable;
import java.util.Date;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Validated  // enable JSR303 data validation
public class UserInfo implements Serializable {
    private static final long serialVersionUID = -40356785423868312L;

    private Long id;

    private String username;

    @Size(min = 8, max = 20)
    private String password;

    @Email(message = "invalid email")
    private String email;

    private String firstName;
    private String lastName;

    /**
     * role (0 admin, 1 user, 2 client)
     */
    private Integer role;

    /**
     * enabled or not (0: init, 1: enabled, -1: disabled (by admin))
     */
    private Integer enabled;

    /**
     * time when created
     */
    private Date createdAt;

    /**
     * time of last modification
     */
    private Date modifiedAt;

    /**
     * a delete flag (0 not deleted, 1 deleted)
     */
    private Integer deleteFlag;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || this.getClass() != o.getClass()) {
            return false;
        }
        UserInfo that = (UserInfo) o;
        // Objects with the same id, username OR email are viewed as the same object
        return getId().equals(that.getId())
                || getUsername().equals(that.getUsername())
                || getEmail().equals(that.getEmail());
    }

    @Override
    public int hashCode() {
        return getId().hashCode();
    }

}
