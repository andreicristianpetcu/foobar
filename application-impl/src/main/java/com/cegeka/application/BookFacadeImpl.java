package com.cegeka.application;

import com.cegeka.domain.books.BookEntity;
import com.cegeka.domain.books.BookRepository;
import com.cegeka.domain.books.BookToMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class BookFacadeImpl implements BookFacade {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BookToMapper bookToMapper;

    @Override
    @PreAuthorize("hasRole(T(com.cegeka.application.Role).USER)")
    public List<BookTo> getBooks() {
        return bookToMapper.from(bookRepository.findAll());
    }

    @Override
    public BookTo getBook(String bookId) {
        return bookToMapper.toTo(bookRepository.findOne(bookId));
    }

    @Override
    @Transactional
    public BookTo saveBook(BookTo newBook) {
        BookEntity bookEntity = bookToMapper.toNewEntity(newBook);
        BookEntity bookEntity1 = bookRepository.saveAndFlush(bookEntity);
        return bookToMapper.toTo(bookEntity1);
    }

    public void setBookRepository(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public void setBookToMapper(BookToMapper bookToMapper) {
        this.bookToMapper = bookToMapper;
    }
}
