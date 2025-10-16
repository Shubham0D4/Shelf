package com.shelf.shelfbackend.dto;

import lombok.Data;

import java.util.Date;

@Data
public class IndividualBookDTO {
    private String id;
    private String title;
    private String author;
    private String publisher;
    private Date pubDate;
    private long totalPages;
    private String language;
    private String fileType;
    private long readPages;
    private String image;
    private String location;

    public IndividualBookDTO(String id, String title, String author, String publisher,
                             Date publishDate, long totalPages, String language,
                             String fileType, long readPages, String image, String location) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.publisher = publisher;
        this.pubDate = publishDate;
        this.totalPages = totalPages;
        this.language = language;
        this.fileType = fileType;
        this.readPages = readPages;
        this.image = image;
        this.location = location;
    }
}