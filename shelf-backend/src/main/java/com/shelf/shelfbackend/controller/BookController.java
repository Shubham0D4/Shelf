package com.shelf.shelfbackend.controller;


import com.shelf.shelfbackend.dto.BooksDTO;
import com.shelf.shelfbackend.dto.IndividualBookDTO;
import com.shelf.shelfbackend.service.BookServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/book")
public class BookController {

    @Autowired
    private BookServices bookServices;

    @GetMapping("/{title}")
    public IndividualBookDTO getBook(@PathVariable String title){
        String newTitle = URLDecoder.decode(title, StandardCharsets.UTF_8);
        return bookServices.getBook(newTitle);
    }

}
