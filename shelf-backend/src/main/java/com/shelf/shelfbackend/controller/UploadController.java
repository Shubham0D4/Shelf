package com.shelf.shelfbackend.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.shelf.shelfbackend.dto.UploadDataDTO;
import com.shelf.shelfbackend.service.UploadServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
public class UploadController {



    @Autowired
    private UploadServices uploadServices;

    @PostMapping("/book")
    public String upload(@RequestParam("bookFile") MultipartFile bookFile,
                         @RequestParam(value = "coverFile", required = false) MultipartFile coverFile,
                         @RequestParam("bookData") String bookDataJson
    )
    {
        try{
            return uploadServices.uploadData(bookFile, coverFile, bookDataJson);
        }
        catch (RuntimeException e){
            System.out.println(e.getMessage());
            return "upload Failed";
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

}
