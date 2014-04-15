package com.cegeka.application;

import com.cegeka.domain.books.BookDetailsEntity;
import com.cegeka.domain.books.BookEntity;
import com.cegeka.domain.books.BookFactory;
import com.cegeka.domain.users.UserEntity;
import org.junit.Test;

import java.util.List;

import static com.cegeka.domain.books.BookEntityTestFixture.newValidBook;
import static com.cegeka.domain.user.UserEntityTestFixture.romeoUser;
import static org.fest.assertions.Assertions.assertThat;

public class BookToMapperTest {
    BookFactory bookFactory = new BookFactory();

    @Test
    public void givenABookWithDetailsAndOneBorrower_WhenMapping_ThenToShouldHaveSameFieldsDetailAndBorrowerList () {
        BookEntity book = newValidBook();
        book.setId("book_id");
        book.setCopies(1);
        BookDetailsEntity bookDetailsEntity = new BookDetailsEntity(
                "2014", "Nemira",
                "http://sciencelakes.com/data_images/out/13/8811007-funny-dog-face.jpg", "Odiseea spatiala 2001");
        book.setDetails(bookDetailsEntity);
        UserEntity romeo = romeoUser();
        romeo.setId("romeo_id");

        book.lendTo(romeo);

        BookTo bookTo = bookFactory.toTo(book, romeo.getId());

        assertThat(bookTo.getId()).isEqualTo(book.getId());
        assertThat(bookTo.getAuthor()).isEqualTo(book.getAuthor());
        assertThat(bookTo.getTitle()).isEqualTo(book.getTitle());
        assertThat(bookTo.getAvailableCopies()).isEqualTo(0);

        assertBookDetails(bookDetailsEntity, bookTo);


        List<BorrowerTo> borrowers = bookTo.getBorrowers();
        assertThat(borrowers.size()).isEqualTo(1);
        assertBorrower(romeo, borrowers.get(0));

        assertThat(bookTo.isBorrowedByCurrentUser()).isEqualTo(true);
    }



    @Test
    public void givenABook_WhenMappingWithNullCurrentUserId_ThenToIsNotBorrowedByCurrentUser () {
        BookEntity book = newValidBook();
        book.lendTo(romeoUser());

        BookTo bookTo = bookFactory.toTo(book, null);

        assertThat(bookTo.isBorrowedByCurrentUser()).isEqualTo(false);
    }

    @Test
    public void givenABookWithNoLender_WhenMapping_ThenToIsNotBorrowedByCurrentUser () {
        BookEntity book = newValidBook();

        BookTo bookTo = bookFactory.toTo(book, "currentUserId");

        assertThat(bookTo.isBorrowedByCurrentUser()).isEqualTo(false);
    }

    @Test
    public void givenABookBorrowedByTheCurrentUser_WhenMapping_ThenToShouldHaveBorrowedByCurrentUser () {
        BookEntity book = newValidBook();
        book.setCopies(2);

        UserEntity romeo = romeoUser();
        romeo.setId("romeo_id");

        book.lendTo(romeo);

        BookTo bookTo = bookFactory.toTo(book, "romeo_id");

        assertThat(bookTo.isBorrowedByCurrentUser()).isTrue();
        assertThat(bookTo.getBorrowers().size()).isEqualTo(1);
        assertBorrower(romeo, bookTo.getBorrowers().get(0));
    }

    @Test
    public void givenABookWithNullDetails_WhenMapping_ThenToHasNoDetails() {
        BookEntity book = newValidBook();
        book.setDetails(null);

        BookTo bookTo = bookFactory.toTo(book, null);

        assertThat(bookTo.getPublishedDate()).isEqualTo(null);
        assertThat(bookTo.getPublisher()).isEqualTo(null);
        assertThat(bookTo.getDescription()).isEqualTo(null);
        assertThat(bookTo.getCoverImage()).isEqualTo(null);
    }

    @Test
    public void givenABookWatchedByTheCurrentUser_WhenMapping_ThenToShouldBeWatchedByCurrentUser () {
        BookEntity book = newValidBook();
        book.setId("book_id");
        book.setCopies(2);

        UserEntity romeo = romeoUser();
        romeo.setId("romeo_id");

        book.addWatcher(romeo);

        BookTo bookTo = bookFactory.toTo(book, "romeo_id");

        assertThat(bookTo.isBorrowedByCurrentUser()).isFalse();
        assertThat(bookTo.isWatchedByCurrentUser()).isTrue();
    }

    @Test
    public void givenABookWithNoBorrowers_WhenMapping_ThenToShouldHaveNoBorrowersAndAllCopiesAvailable () {
        BookEntity book = newValidBook();
        book.setId("book_id");
        book.setCopies(2);

        BookTo bookTo = bookFactory.toTo(book, null);

        assertThat(bookTo.getAvailableCopies()).isEqualTo(2);
        assertThat(bookTo.getBorrowers().size()).isEqualTo(0);
    }

    @Test
    public void givenABookWithMoreThanOneBorrower_WhenMapping_ThenToHasSameBorrowers () {
        BookEntity book = newValidBook();
        book.setId("book_id");
        book.setCopies(3);

        UserEntity romeo = romeoUser();
        romeo.setId("romeo_id");

        book.lendTo(romeo);
        book.lendTo(romeo);

        BookTo bookTo = bookFactory.toTo(book, "random_user_id");

        assertThat(bookTo.getAvailableCopies()).isEqualTo(1);
        assertThat(bookTo.getBorrowers().size()).isEqualTo(2);

        BorrowerTo borrowerTo = new BorrowerTo(romeo.getId(), romeo.getProfile().getFullName(), romeo.getEmail());

        assertThat(bookTo.getBorrowers()).contains(borrowerTo);
        assertThat(bookTo.isBorrowedByCurrentUser()).isEqualTo(false);
    }

    private void assertBookDetails(BookDetailsEntity bookDetailsEntity, BookTo bookTo) {
        assertThat(bookTo.getPublishedDate()).isEqualTo(bookDetailsEntity.getPublishedDate());
        assertThat(bookTo.getPublisher()).isEqualTo(bookDetailsEntity.getPublisher());
        assertThat(bookTo.getCoverImage()).isEqualTo(bookDetailsEntity.getCoverImage());
        assertThat(bookTo.getDescription()).isEqualTo(bookDetailsEntity.getDescription());
    }

    private void assertBorrower(UserEntity romeo, BorrowerTo borrowerTo) {
        assertThat(borrowerTo.getId()).isEqualTo(romeo.getId());
        assertThat(borrowerTo.getUserName()).isEqualTo(romeo.getProfile().getFullName());
    }

}
