package com.giv.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home(){
        return "Bem-vindo ao projeto GIAV - Associação Ação Vida!";
    }
}