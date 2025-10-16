package com.shelf.shelfbackend.dto;

import lombok.Data;

import java.util.Date;

@Data
public class HistoryDTO {
    String id;
    String bookId;
    long readPages;
    Date updatedDate;
}
