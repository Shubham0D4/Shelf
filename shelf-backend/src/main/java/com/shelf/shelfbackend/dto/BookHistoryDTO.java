package com.shelf.shelfbackend.dto;

import lombok.Data;

@Data
public class BookHistoryDTO {

    private String bookId;
    private String title;
    private String author;
    private String publisher;
    private long totalPages;
    private String image;
    private long readPages;

    public BookHistoryDTO(String bookId, String title, String author, String publisher,
                          long totalPages, String image, long readPages) {
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.publisher = publisher;
        this.totalPages = totalPages;
        this.image = image;
        this.readPages = readPages;
    }

}
