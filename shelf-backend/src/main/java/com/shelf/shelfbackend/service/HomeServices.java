package com.shelf.shelfbackend.service;

import com.shelf.shelfbackend.dto.BookHistoryDTO;
import com.shelf.shelfbackend.dto.BooksDTO;
import com.shelf.shelfbackend.dto.SearchDTO;
import com.shelf.shelfbackend.repositories.BookDetailsRepo;
import com.shelf.shelfbackend.repositories.HistoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class HomeServices {

    @Autowired
    private HistoryRepo historyRepo;

    @Autowired
    private BookDetailsRepo booksDetailsRepo;


    public List<BookHistoryDTO> getHistory() {
        return historyRepo.findAllBookHistory();
    }

    public List<BooksDTO> getBooks() {
        return booksDetailsRepo.findAllBooks();
    }

    public List<SearchDTO> getSearchList() {
        List<SearchDTO> searchDTOList = new ArrayList<>();
        List<SearchDTO> bookList = booksDetailsRepo.findBookSearchList();
        List<SearchDTO> authorList = booksDetailsRepo.findAuthorsSearchList();
        List<SearchDTO> publisherList = booksDetailsRepo.findPublisherSearchList();

        for(SearchDTO book : bookList) {
            book.setType("book");
        }
        for(SearchDTO author : authorList) {
            author.setType("author");
        }
        for(SearchDTO publisher : publisherList) {
            publisher.setType("publisher");
        }
        searchDTOList.addAll(bookList);
        searchDTOList.addAll(authorList);
        searchDTOList.addAll(publisherList);

        return searchDTOList;
    }

}
