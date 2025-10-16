package com.shelf.shelfbackend.configuration;


import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "minio")
public class MinioPropertiesConfig {

    private String url;
    private String accessKey;
    private String secretKey;

}
