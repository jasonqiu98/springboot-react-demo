package com.jasonqiu.springbootreactdemo.security.utils;

import java.security.SecureRandom;
import java.util.Base64;

public class TokenUtils {

    private static class Holder {
        static final SecureRandom numberGenerator = new SecureRandom();
    }

    /**
     * generate a 20-char long random username
     * borrowed from https://www.jianshu.com/p/4ebbb1ce94f4 (content in Chinese)
     */
    public static String generate() {
        byte[] bytes = new byte[15];
        Holder.numberGenerator.nextBytes(bytes);
        /**
         * https://gist.github.com/aegis123/6020974
         */
        String username = new String(Base64.getUrlEncoder().encode(bytes));
        return username;
    }
    
    // public static void main(String[] args) {
    //     String username = generate();
    //     byte[] bytes = Base64.getUrlDecoder().decode(username);
    //     System.out.println(Arrays.toString(bytes));
    // }
    
}
