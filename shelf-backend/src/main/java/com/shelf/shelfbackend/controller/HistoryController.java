package com.shelf.shelfbackend.controller;

import com.shelf.shelfbackend.dto.HistoryDTO;
import com.shelf.shelfbackend.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/book")
public class HistoryController {

    @Autowired
    private HistoryService historyService;

    @PostMapping("/history")
    public void saveHistory(@RequestBody HistoryDTO history) {
        historyService.saveHistory(history);
    }
}
