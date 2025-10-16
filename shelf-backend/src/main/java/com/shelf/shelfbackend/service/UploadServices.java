package com.shelf.shelfbackend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shelf.shelfbackend.dto.IndividualBookDTO;
import com.shelf.shelfbackend.dto.UploadDataDTO;
import com.shelf.shelfbackend.model.Books;
import com.shelf.shelfbackend.model.BooksDetails;
import com.shelf.shelfbackend.repositories.BookDetailsRepo;
import com.shelf.shelfbackend.repositories.BooksRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Service
public class UploadServices {

    @Autowired
    private BooksRepo booksRepo;

    @Autowired
    private BookDetailsRepo bookDetailsRepo;

    @Autowired
    private MinioService minioService;




    public String uploadData(MultipartFile bookFile, MultipartFile coverFile, String bookDataJson) throws JsonProcessingException {

        ObjectMapper mapper = new ObjectMapper();
        UploadDataDTO uploadDataDTO = mapper.readValue(bookDataJson, UploadDataDTO.class);
        System.out.println(uploadDataDTO);

        String bookFileName = bookFile.getOriginalFilename();
        String coverFileName = coverFile.getOriginalFilename();

        String bookResult = minioService.uploadBook(bookFile);
        String coverResult = minioService.uploadCover(coverFile);

        BooksDetails booksDetails = new BooksDetails();
        booksDetails.setId(uploadDataDTO.getId());
        booksDetails.setAuthor(uploadDataDTO.getAuthor());
        booksDetails.setTitle(uploadDataDTO.getTitle());
        booksDetails.setImage(coverFileName);
        booksDetails.setPublisher(uploadDataDTO.getPublisher());
        booksDetails.setPubDate(uploadDataDTO.getPubDate());
        booksDetails.setTotalPages(uploadDataDTO.getTotalPages());
        booksDetails.setLanguage(uploadDataDTO.getLanguage());
        booksDetails.setLocation(bookFileName);

        Books book = new Books(uploadDataDTO.getId(), uploadDataDTO.getFileType(), new Date(), booksDetails);

        bookDetailsRepo.save(booksDetails);
        booksRepo.save(book);

        System.out.println(bookResult);
        System.out.println(coverResult);

        return "upload Successfully";
    }

}
