package com.shelf.shelfbackend.repositories;

import com.shelf.shelfbackend.dto.IndividualBookDTO;
import com.shelf.shelfbackend.model.Books;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface BooksRepo extends JpaRepository<Books, String> {

    @Query("SELECT new com.shelf.shelfbackend.dto.IndividualBookDTO(" +
            "bd.id, bd.title, bd.author, bd.publisher, bd.pubDate, bd.totalPages, " +
            "bd.language, b.fileType, COALESCE(h.readPages, 0), bd.image, bd.location) " +
            "FROM Books b " +
            "JOIN b.book bd " +
            "LEFT JOIN History h ON h.book.id = bd.id " +
            "WHERE bd.title = :title")
    IndividualBookDTO findBook(@Param("title") String title);




}
