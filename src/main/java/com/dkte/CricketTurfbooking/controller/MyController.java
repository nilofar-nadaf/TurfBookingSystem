package com.dkte.CricketTurfbooking.controller;

import com.dkte.CricketTurfbooking.User.RegistrationForm;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.ArrayList;
import java.util.List;

@Controller
public class MyController {

    // 🧩 Temporary storage for registered users
    private List<RegistrationForm> registeredUsers = new ArrayList<>();

    // ✅ Registration page
    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("registrationForm", new RegistrationForm());
        return "registration";
    }

    // ✅ Handle registration
    @PostMapping("/register")
    public String registerUser(
            @Valid @ModelAttribute("registrationForm") RegistrationForm form,
            BindingResult result,
            Model model) {

        if (!form.getPassword().equals(form.getCpassword())) {
            result.rejectValue("cpassword", "PasswordMismatch", "Passwords do not match.");
        }

        if (result.hasErrors()) {
            return "registration";
        }

        // Save user in memory
        registeredUsers.add(form);
        System.out.println("✅ Registered user: " + form.getUsername());

        return "redirect:/login";
    }

    // ✅ Login page
    @GetMapping("/login")
    public String loginPage(Model model) {
        model.addAttribute("registrationForm", new RegistrationForm());
        return "login";
    }

    // ✅ Handle login
 // File: MyController.java

 // ... (other imports and class definition)

     // ✅ Handle login
     @PostMapping("/login")
     public String loginUser(@ModelAttribute("registrationForm") RegistrationForm form, Model model) {
         for (RegistrationForm user : registeredUsers) {
             if (user.getUsername().equals(form.getUsername()) &&
                 user.getPassword().equals(form.getPassword())) {
                 
                 // Store the username in the Model to be available in the home page
                 model.addAttribute("username", user.getUsername()); 
                 
                 // Add a success message to the Model
                 model.addAttribute("loginSuccessMessage", "Login successful!"); 
                 
                 System.out.println("✅ Login successful for: " + user.getUsername());
                 
                 // To keep the username and message after a POST-redirect-GET,
                 // we should redirect and use RedirectAttributes, but since the
                 // original design does a direct return, we will pass the data
                 // to the home page directly via the model.
                 return "home"; // go to home.html
             }
         }

         model.addAttribute("error", "Invalid username or password!");
         System.out.println("❌ Login failed for: " + form.getUsername());
         return "login";
     }

    

    // ✅ Other pages
    @GetMapping("/")
    public String homeRedirect() { return "home"; }

    @GetMapping("/home")
    public String homePage() { return "home"; }

    @GetMapping("/bookNow")
    public String bookNowPage() { return "bookNow"; }

    @GetMapping("/bookingConfirm")
    public String bookingConfirmPage() { return "bookingConfirm"; }

    @GetMapping("/searchTurf")
    public String searchTurfPage() { return "searchTurf"; }

    @GetMapping("/aboutUs")
    public String aboutUsPage() { return "aboutUs"; }

    @GetMapping("/contactUs")
    public String contactUsPage() { return "contactUs"; }
}
