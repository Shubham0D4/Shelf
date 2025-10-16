package com.shelf.shelfbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class BooksDTO {

    private String id;
    private String title;
    private String author;
    private String publisher;
    private String language;
    private long totalPages;
    private String image;
}
