package com.shelf.shelfbackend.repositories;

import com.shelf.shelfbackend.dto.BookHistoryDTO;
import com.shelf.shelfbackend.model.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HistoryRepo extends JpaRepository<History, String> {

    @Query("SELECT new com.shelf.shelfbackend.dto.BookHistoryDTO(" +
            "b.id, b.title, b.author, b.publisher, b.totalPages, b.image, " +
            "h.readPages) " +
            "FROM History h " +
            "JOIN h.book b")
    List<BookHistoryDTO> findAllBookHistory();

    Optional<History> findByBook_Id(String bookId);





}
