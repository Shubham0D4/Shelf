package com.shelf.shelfbackend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
public class History {

    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    private long readPages;
    private Date updatedDate;

    @ManyToOne
    @JoinColumn(name = "bookId")
    private BooksDetails book;

}
