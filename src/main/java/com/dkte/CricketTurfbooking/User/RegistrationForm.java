package com.dkte.CricketTurfbooking.User;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;

public class RegistrationForm {

    @NotBlank(message = "Full Name is required")
    private String fullName;

    @NotBlank(message = "Username is required")
    private String username;

    @Email(message = "Enter a valid email address")
    @NotBlank(message = "Email is required")
    @Pattern(regexp = ".*@gmail\\.com$", message = "Email must have the domain @gmail.com")
    private String email;

    @NotBlank(message = "Phone Number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone Number must contain exactly 10 digits")
    private String phoneNumber;

    @NotBlank(message = "Password is required")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+={}\\[\\]:;\"'<>,.?/\\\\-]).{8,}$",
        message = "Password must be at least 8 characters, including upper/lower case, digit, and special character."
    )
    private String password;

    @NotBlank(message = "Confirm Password is required")
    private String cpassword;

    @NotEmpty(message = "Role must be selected")
    private String userRole;

    // ---------------- Getters & Setters ----------------

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCpassword() {
        return cpassword;
    }

    public void setCpassword(String cpassword) {
        this.cpassword = cpassword;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }
}
