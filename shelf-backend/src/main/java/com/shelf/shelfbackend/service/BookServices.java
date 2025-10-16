package com.shelf.shelfbackend.service;

import com.shelf.shelfbackend.dto.IndividualBookDTO;
import com.shelf.shelfbackend.repositories.BooksRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BookServices {

    @Autowired
    private BooksRepo booksRepo;

    public IndividualBookDTO getBook(String title){
        return booksRepo.findBook(title);
    }

}
