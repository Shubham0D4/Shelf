package com.shelf.shelfbackend.dto;


import lombok.Data;



@Data
public class SearchDTO {
    private String type;
    private String name;
    private String id;

    public SearchDTO(String name, String id) {
        this.name = name;
        this.id = id;
    }

}
