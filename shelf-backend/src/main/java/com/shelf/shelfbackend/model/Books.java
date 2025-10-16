package com.shelf.shelfbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Books {
    @Id
    private String id;
    private Date dateTime;
    private String fileType;

    @ManyToOne
    @JoinColumn(name = "bookId")
    private BooksDetails book;

    public Books(String id, String fileType, Date dateTime,  BooksDetails book) {
        this.id = id;
        this.fileType = fileType;
        this.book = book;
        this.dateTime = dateTime;
    }
}
