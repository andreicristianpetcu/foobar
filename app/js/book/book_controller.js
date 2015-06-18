'use strict';

/* Controllers */

angular.module('book.bookController', [])

  .controller('BooksController', ['Books', '$scope', '$location', 'Auth', 'Alerts', '$routeParams', BooksController]);


function BooksController(Books, $scope, $location, Auth, Alerts, $routeParams) {
    $scope.book_id = $routeParams.bookId;

    //TODO: Move this to its own controller and write a test to check no other posts are made
    //Or maybe not, if we want to add Borrow/Return buttons to the view book screen
    if ($routeParams.bookId) {
        Books.getBook($scope.book_id,
            function success(responseData) {
                $scope.book = responseData;
            },
            Alerts.handler
        );
    }
    Books.getBooks(
        function success(responseData) {
            $scope.books = responseData;
        },
        Alerts.handler
    );

    var MENU_ACTION_IDS = {
        ACTION_1: 'ACTION_1'
    };

    $scope.sidebarMenuItems = [
        {id: MENU_ACTION_IDS.ACTION_1, text: 'Action 1' }
    ];


    $scope.sidebarActionSelected = function (sidebarAction) {
        console.log(sidebarAction);
        alert(sidebarAction.text + " was clicked");
    }

    $scope.addBook = function () {
        Books.addBook($scope.book)
            .then(function () {
                $location.path('/books');
            },
            Alerts.handler);
    }

    $scope.borrowBook = function (book) {
        Books.borrowBook(book)
            .then(function(response) {
                angular.copy(response.data, book);
                Alerts.successHandler("Happy reading!")
            },
            Alerts.handler);
    }

    $scope.returnBook = function (book) {
        Books.returnBook(book)
            .then(function(response) {
                angular.copy(response.data, book);
                Alerts.successHandler("Thanks for returning the book!")
            },
            Alerts.handler);
    }

    $scope.watchBook = function (book) {
        Books.watchBook(book)
            .then(function(response) {
                angular.copy(response.data, book);
                Alerts.successHandler("You will be notified when " + book.title + " becomes available");
            },
            Alerts.handler);
    }

    $scope.unwatchBook = function (book) {
        Books.unwatchBook(book)
            .then(function(response) {
                angular.copy(response.data, book);
                Alerts.successHandler("You will not receive any notifications about " + book.title);
            },
            Alerts.handler);
    }

    $scope.lookUpByIsbn = function (isbn) {
        Books.lookUpBookByIsbn(isbn,
            function success(responseData) {
                $scope.temp = {};
                if(responseData.totalItems > 0){
                    var bookData = responseData.items[0];
                    $scope.book = {};
                    $scope.temp.found = true;
                    $scope.book.isbn = isbn;
                    $scope.book.title = bookData.volumeInfo.title;
                    $scope.book.author = bookData.volumeInfo.authors.join(", ");
                    $scope.book.coverImage = bookData.volumeInfo.imageLinks.thumbnail;
                    $scope.book.publishedDate = bookData.volumeInfo.publishedDate;
                    $scope.book.publisher = bookData.volumeInfo.publisher;
                    $scope.book.description = bookData.volumeInfo.description;
                } else {
                    $scope.temp.found = false;
                }
            },
            Alerts.handler
        );
    }

    $scope.saveAvailableCopies = function(availableCopies){
        Books.updateNumberOfCopies($scope.book, availableCopies);
    }

    $scope.validateAvailableCopies = function(oldVal, newVal){
        return oldVal < newVal ? "VALID" : ("Please select a value that is bigger than " + oldVal);
    }
}
