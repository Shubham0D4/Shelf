package com.shelf.shelfbackend.dto;

import lombok.Data;

import java.util.Date;

@Data
public class UploadDataDTO {
    private String id;
    private String title;
    private String author;
    private String publisher;
    private Date pubDate;
    private String language;
    private long totalPages;
    private String fileType;
    private Date dateTime;


}
