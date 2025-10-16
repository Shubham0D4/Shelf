package com.shelf.shelfbackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class BooksDetails {

    @Id
    private String id;
    private String location;
    private String title;
    private String author;
    private String publisher;
    private String image;
    private Date pubDate;
    private String language;
    private long totalPages;



}
