package com.shelf.shelfbackend.repositories;

import com.shelf.shelfbackend.dto.BooksDTO;
import com.shelf.shelfbackend.dto.SearchDTO;
import com.shelf.shelfbackend.model.BooksDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookDetailsRepo extends JpaRepository<BooksDetails, String> {

    @Query("SELECT new com.shelf.shelfbackend.dto.BooksDTO(" +
            "b.id, b.title, b.author, b.publisher, b.language, b.totalPages, b.image)" +
            "FROM BooksDetails  b")
    List<BooksDTO> findAllBooks();

    @Query("SELECT new com.shelf.shelfbackend.dto.SearchDTO(b.title, b.id) FROM BooksDetails b")
    List<SearchDTO> findBookSearchList();

    @Query("SELECT new com.shelf.shelfbackend.dto.SearchDTO(b.author, b.id) FROM BooksDetails b")
    List<SearchDTO> findAuthorsSearchList();

    @Query("SELECT new com.shelf.shelfbackend.dto.SearchDTO(b.publisher, b.id) FROM BooksDetails b")
    List<SearchDTO> findPublisherSearchList();

}
