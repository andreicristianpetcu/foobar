package com.cegeka.domain.bookloans;

import com.cegeka.domain.books.BookEntity;
import com.cegeka.domain.users.UserEntity;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "BOOKLOANS")
public class BookLoanEntity {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    private String id;

    @ManyToOne
    @JoinColumn(nullable = false)
    BookEntity book;

    @ManyToOne
    @JoinColumn(nullable = false)
    UserEntity user;

    @Column(nullable = false)
    Date startDate;

    Date endDate;

    public BookLoanEntity() {
    }

    public BookLoanEntity(BookEntity book, UserEntity user) {
        this.book = book;
        this.user = user;
        this.startDate = new Date(System.currentTimeMillis());
    }

    public BookLoanEntity(BookEntity book, UserEntity user, Date startDate) {
        this.book = book;
        this.user = user;
        this.startDate = startDate;
    }

    public BookLoanEntity(BookEntity book, UserEntity user, Date startDate, Date endDate) {
        this.book = book;
        this.user = user;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public String getId() {
        return id;
    }

    public BookEntity getBook() {
        return book;
    }

    public void setBook(BookEntity book) {
        this.book = book;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof BookLoanEntity)) return false;

        BookLoanEntity that = (BookLoanEntity) o;

        if (book != null ? !book.equals(that.book) : that.book != null) return false;
        if (startDate != null ? !startDate.equals(that.startDate) : that.startDate != null) return false;
        if (user != null ? !user.equals(that.user) : that.user != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = book != null ? book.hashCode() : 0;
        result = 31 * result + (user != null ? user.hashCode() : 0);
        result = 31 * result + (startDate != null ? startDate.hashCode() : 0);
        return result;
    }
}

