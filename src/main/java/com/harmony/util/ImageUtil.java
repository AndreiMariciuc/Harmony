package com.harmony.util;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Date;
import java.util.Optional;
import java.util.Random;

public class ImageUtil {

    private static final String imgPatternUrl = "/img/";

    public static Optional<String> upload(MultipartFile image, String path) {
        String imageName = generateRandomName(image.getOriginalFilename());

        try {
            File newFile = new File(path + imageName);

            Files.createDirectories(newFile.toPath().getParent());
            Files.write(newFile.toPath(), image.getBytes());
        } catch (IOException ioException) {
            System.out.println(ioException.getMessage());
            return Optional.empty();
        }

        return Optional.of(imgPatternUrl + imageName);
    }

    private static String generateRandomName(String originalFileName) {
        return new Date().getTime() + "-" + new Random().nextInt() % 100 + "-" + originalFileName;
    }

    //in cazul in care o sa vrem asa ceva <3:))
    public static void delete(String imageName, String path) {
        try {
            File deletedFile = new File(path + imageName);
            Files.delete(deletedFile.toPath());
        } catch (IOException ioException) {
            System.out.println(ioException.getMessage());
        }
    }
}