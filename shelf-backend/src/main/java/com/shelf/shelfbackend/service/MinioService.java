package com.shelf.shelfbackend.service;


import io.minio.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Service
public class MinioService {

    private final MinioClient minioClient;

    @Value("${custom.book-bucket-name}")
    private String bookBucketName;

    @Value("${custom.cover-bucket-name}")
    private String coverBucketName;


    public MinioService(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    @PostConstruct
    public void initializeBuckets() {
        try {

            boolean bookFlag = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bookBucketName).build());
            if (!bookFlag) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bookBucketName).build());
            }

            boolean coverFlag = minioClient.bucketExists(BucketExistsArgs.builder().bucket(coverBucketName).build());
            if (!coverFlag) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(coverBucketName).build());
            }

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error during Minio bucket initialization: ", e);
        }
    }

    public String uploadBook(MultipartFile book){
        try{
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bookBucketName)
                            .object(book.getOriginalFilename())
                            .stream(book.getInputStream(), book.getSize(), -1)
                            .contentType(book.getContentType())
                            .build()
            );
            return "Book uploaded successfully" + book.getOriginalFilename();
        }
        catch (Exception e){
            e.printStackTrace();
            throw new RuntimeException("Error in upload book: ", e);
        }
    }

    public String uploadCover(MultipartFile cover){
        try{
            minioClient.putObject(
                        PutObjectArgs.builder()
                                .bucket(coverBucketName)
                                .object(cover.getOriginalFilename())
                                .stream(cover.getInputStream(), cover.getSize(), -1)
                                .contentType(cover.getContentType())
                                .build()
            );
            return "Cover uploaded successfully" + cover.getOriginalFilename();
        }
        catch (Exception e){
            e.printStackTrace();
            throw new RuntimeException("Error in upload cover: ", e);
        }
    }

    public InputStream downloadCover(String coverName){
        try{
            return minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(coverBucketName)
                            .object(coverName)
                            .build()
            );
        }
        catch (Exception e){
            e.printStackTrace();
            throw new RuntimeException("Error in download cover: ", e);
        }
    }

    public InputStream downloadBook(String bookName){
        try{
            return minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bookBucketName)
                            .object(bookName)
                            .build()
            );
        }
        catch (Exception e){
            e.printStackTrace();
            throw new RuntimeException("Error in download book: ", e);
        }
    }

}
