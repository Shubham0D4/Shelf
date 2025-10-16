package com.shelf.shelfbackend.configuration;


import io.minio.MinioClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MinioConfig {

    private final MinioPropertiesConfig minioProperties;


    public MinioConfig(MinioPropertiesConfig minioProperties) {
        this.minioProperties = minioProperties;

    }

    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(minioProperties.getUrl())
                .credentials(minioProperties.getAccessKey(), minioProperties.getSecretKey())
                .build();
    }
}
