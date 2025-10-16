package com.shelf.shelfbackend.service;

import com.shelf.shelfbackend.dto.HistoryDTO;
import com.shelf.shelfbackend.model.BooksDetails;
import com.shelf.shelfbackend.model.History;
import com.shelf.shelfbackend.repositories.BookDetailsRepo;
import com.shelf.shelfbackend.repositories.HistoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class HistoryService {

    @Autowired
    HistoryRepo historyRepo;

    @Autowired
    BookDetailsRepo booksDetails;

    public void saveHistory(HistoryDTO history) {
        Optional<BooksDetails> book = booksDetails.findById(history.getBookId());
        if (book.isEmpty()) return;

        // check if record already exists for this book
        Optional<History> existing = historyRepo.findByBook_Id(history.getBookId());

        History demoHistory;
        if (existing.isPresent()) {
            // update existing record
            demoHistory = existing.get();
            demoHistory.setReadPages(history.getReadPages());
            demoHistory.setUpdatedDate(new Date());
        } else {
            // create new record
            demoHistory = new History();
            demoHistory.setId(history.getId());
            demoHistory.setBook(book.get());
            demoHistory.setReadPages(history.getReadPages());
            demoHistory.setUpdatedDate(new Date());
        }

        historyRepo.save(demoHistory);
    }


}
