package com.shelf.shelfbackend.controller;

import com.shelf.shelfbackend.service.DownloadServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;

@RestController
@RequestMapping("/api/download")
public class DownloadController {

    @Autowired
    DownloadServices downloadServices;

    @GetMapping("/cover/{link}")
    public ResponseEntity<byte[]> getCover(@PathVariable("link") String link) throws IOException {
        InputStream is = downloadServices.getCover(link);
        byte[] bytes = is.readAllBytes();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + link + "\"")
                .contentType(MediaType.IMAGE_JPEG)
                .body(bytes);
    }

    @GetMapping("/book/{link}")
    public ResponseEntity<byte[]> getBook(@PathVariable("link") String link) throws IOException {
        InputStream is = downloadServices.getBook(link);
        byte[] bytes = is.readAllBytes();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + link + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(bytes);
    }
}
