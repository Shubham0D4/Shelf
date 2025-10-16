package com.shelf.shelfbackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.InputStream;

@Service
public class DownloadServices {

    @Autowired
    MinioService minioService;

    public InputStream getCover(String link) {
        return minioService.downloadCover(link);
    }

    public InputStream getBook(String link) {
        return minioService.downloadBook(link);
    }
}
