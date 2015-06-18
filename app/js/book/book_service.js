'use strict';

/* Services */

angular.module('book.bookService', ['ngCookies', 'http-auth-interceptor'])
    .value('version', '0.1')

    .factory('Books', ['$http', 'BOOK_URLS', function ($http, BOOK_URLS) {
        //TODO consistency - use successCallback/errorCallback in all methods or in none.
        //TODO - test me, test me pleaaaase
        function getBooks(successCallback, errorCallback) {
            $http.get(BOOK_URLS.BOOKS)
                .success(function (data) {
                    successCallback(data);
                })
                .error(errorCallback);
        }

        function lookUpBookByIsbn(bookIsbn, successCallback, errorCallback) {
            $http.jsonp(BOOK_URLS.BOOKS_BY_ISBN_GOOGLE + bookIsbn)
                .success(function (data) {
                    successCallback(data);
                })
                .error(errorCallback);
        }

        function getBook(bookId, successCallback, errorCallback) {
            $http.get(BOOK_URLS.BOOK + '/' + bookId)
                .success(function (data) {
                    successCallback(data);
                })
                .error(function (error) {
                    errorCallback(error);
                });
        }

        function addBook(book) {
            return $http.post(BOOK_URLS.BOOK, book);
        }

        function borrowBook(book) {
            return $http.post(BOOK_URLS.BORROW, book.id);
        }

        //TODO: test me pls
        function returnBook(book) {
            return $http.post(BOOK_URLS.RETURN, book.id);
        }

        function watchBook(book) {
            return $http.post(BOOK_URLS.WATCH, book.id);
        }


        function unwatchBook(book) {
            return $http.post(BOOK_URLS.UNWATCH, book.id);
        }

        //TODO: test me pls
        function updateNumberOfCopies(book, availableCopies) {
            var url = BOOK_URLS.UPDATE_NUMBER_OF_COPIES.replace('{bookId}', book.id);
            url = url.replace('{numberOfCopies}', availableCopies);
            return $http.post(url);
        }

        return {
            getBooks: getBooks,
            getBook: getBook,
            addBook: addBook,
            borrowBook: borrowBook,
            returnBook: returnBook,
            watchBook: watchBook,
            unwatchBook: unwatchBook,
            lookUpBookByIsbn: lookUpBookByIsbn,
            updateNumberOfCopies: updateNumberOfCopies
        };
    }])

  .constant('BOOK_URLS', {
    BOOKS: 'http://libraryapp.cegeka.com:8080/backend/rest/books',
    BOOK: 'http://libraryapp.cegeka.com:8080/backend/rest/book',
    BORROW: 'http://libraryapp.cegeka.com:8080/backend/rest/borrow',
    RETURN: 'http://libraryapp.cegeka.com:8080/backend/rest/return',
    WATCH: 'http://libraryapp.cegeka.com:8080/backend/rest/watch',
    UNWATCH: 'http://libraryapp.cegeka.com:8080/backend/rest/unwatch',
    UPDATE_NUMBER_OF_COPIES: 'http://libraryapp.cegeka.com:8080/backend/rest/book/{bookId}/updateNumberOfCopies/{numberOfCopies}',
    BOOKS_BY_ISBN_GOOGLE: 'https://www.googleapis.com/books/v1/volumes?callback=JSON_CALLBACK&q=isbn:'
  })
;

