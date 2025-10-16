package com.shelf.shelfbackend.controller;


import com.shelf.shelfbackend.dto.BookHistoryDTO;
import com.shelf.shelfbackend.dto.BooksDTO;
import com.shelf.shelfbackend.dto.SearchDTO;
import com.shelf.shelfbackend.service.HomeServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/home")
public class HomeController {

    @Autowired
    private HomeServices homeServices;

    @GetMapping("/history")
    public List<BookHistoryDTO> getHistory() {
        return homeServices.getHistory();
    }

    @GetMapping("/books")
    public List<BooksDTO> getBooks(){
        return homeServices.getBooks();
    }

    @GetMapping("/search")
    public List<SearchDTO> getSearches(){
        return homeServices.getSearchList();
    }

}
