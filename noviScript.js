'use strict';

//------------------------------- localStorage ------------------------------------------
var locStorage = (function () {
    var loadFromLocalStorage = function (nameOfObject) {
        var object = localStorage.getItem(nameOfObject);
        if (object == null) object = "{}";
        return JSON.parse(object);
    };
    var saveToLocalStorage = function (nameOfObject, object) {
        localStorage.setItem(nameOfObject, JSON.stringify(object));
    };
    var delFromLocalStorages = function (nameOfObject, object) {
        delete nameOfObject[object];
    };
    return {
        delete: delFromLocalStorages,
        load: loadFromLocalStorage,
        save: saveToLocalStorage
    }
})();

// --------------------------------- Show i hide ---------------------------------

function val(element, value) {
    if (!document.getElementById(element)){
        console.log(" ne postoji id ",element);
        return;
    }
    if (!value) {
        return document.getElementById(element).value;
    } else {
        document.getElementById(element).value = value;
    }
}

function show(id) {
    if (!document.getElementById(id)){
        console.log(" ne postoji id ",id);
        return;
    }
    document.getElementById(id).style.display = "block";
}

function hide(id) {
    if (!document.getElementById(id)){
        console.log(" ne postoji id ",id);
        return;
    }
    document.getElementById(id).style.display = "none";
}

//---------------------------------- metode za registraciju i log in ---------------------------------------
var forgetLog = function () {
    var log = locStorage.load('loggedInUser');
    var isUserLogedIn = function () {
        if (typeof log.name == "undefined") {
            show("logIn");
            hide("logOut");
        }
        else {
            document.getElementById("logIn");
            show("logOut");
        }
    };
    document.body.addEventListener("load", isUserLogedIn());

    var User = function (name, lastName, email, gender, password) {
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.gender = gender;
        this.password = password;
    };

    var allUsers = locStorage.load("allUsers");
    if (allUsers == null) allUsers = {};
    var createUser = function () {
        var name = document.getElementById("userName").value;
        var lastName = document.getElementById("userLastname").value;
        var email = document.getElementById("userEmail").value;
        var gender = document.querySelector('input[name="gender"]:checked').value;
        var password = document.getElementById("userPassword").value;
        return new User(name, lastName, email, gender, password);
    };
    var addUserToAllUsers = function (email) {
        if (!allUsers[email]) {
            allUsers[email] = createUser();
            return allUsers;
        }
        else console.log("Niste uneli sve podatke, molimo Vas popunite sva polja!");
    };
    document.getElementById("createAcount").addEventListener("click", function () {
        createUser();
        addUserToAllUsers(document.getElementById("userEmail").value);
        locStorage.save("allUsers", allUsers);
        hide("register");
        show("logIn");
    });
    document.getElementById("registerButton").addEventListener("click", function () {
        show("register");
        hide("logIn");
    });
    document.getElementById("forgetPassButton").addEventListener("click", function () {
        show("forgetPassword");
    });
    var validateUser = function (email, password) {
        return allUsers[email].password == password;
    };
    document.getElementById("logInButton").addEventListener("click", function (e) {
        e.preventDefault();
        var email = document.getElementById("email").value;
        var password = document.getElementById("pass").value;
        location.reload();

        if (typeof allUsers[email] != 'undefined' && validateUser(email, password) == true) {
            locStorage.save("loggedInUser", allUsers[email]);
            show("logOut");
            hide("logIn");

        } else {
            console.log("E-mail ili password je neispravan, pokusajte ponovo");
        }

    });
    document.getElementById("logOut").addEventListener("click", function () {
        location.reload();
        console.log("da li je ulogovan: " + log);
        localStorage.removeItem("loggedInUser");
        hide("logOut");
        show("logIn");
    });
    document.getElementById("forgetPassButton").addEventListener("click", function () {
        show("forgetPassword");
        hide("logIn");
    });
    document.getElementById("sendEmail").addEventListener("click", function () {
        var email = document.getElementById("forgetPass").value;
        var password = allUsers[email].password;
        console.log("Vas password je: " + password);
    });
    return {
        log: log,
        createUser: createUser,
        addUserToAllUsers: addUserToAllUsers
    }
};
forgetLog();

// ----------------------- otvaranje i zatvaranje formi ------------------------------------

document.getElementById("newStudent").addEventListener("click", function () {
    show("addNewStudent");
    hide("subjects1");
    hide("addNewProfessor");
    hide("profilePage");
    show("listOfStudents");
    show("profile");
});
document.getElementById("profile").addEventListener("click", function () {
    var loggedInUser = locStorage.load("loggedInUser");
    document.getElementById("myName").textContent = loggedInUser.name;
    document.getElementById("myLastName").textContent = loggedInUser.lastName;
    document.getElementById("myGender").textContent = loggedInUser.gender;
    document.getElementById("myEmail").textContent = loggedInUser.email;
    show("profilePage");
    hide("profile");
    hide("addNewStudent");
    hide("addNewProfessor");
    hide("subjects1");
    hide("listOfStudents")

});
document.getElementById("closeProfile").addEventListener("click", function () {
    hide("profilePage");
    show("profile");
});
document.getElementById("closeStudentForm").addEventListener("click", function () {
    hide("addNewStudent");
    hide("listOfStudents");
    show("newStudent");
});
document.getElementById("closeForgetPassword").addEventListener("click", function () {
    hide("forgetPassword");
    show("logIn");
});
document.getElementById("closeRegistration").addEventListener("click", function () {
    hide("register");
    show("logIn");
});
document.getElementById("listOfSubjects").addEventListener("click", function () {
    show("subjects1");
    hide("addNewStudent");
    hide("addNewProfessor");
    hide("profilePage");
    hide("listOfStudents");
    show("profile");
});
document.getElementById("closeSubjectList").addEventListener("click", function () {
    hide("subjects1");
});
document.getElementById("newProfessor").addEventListener("click", function () {
    show("addNewProfessor");
    hide("subjects1");
    hide("addNewStudent");
    hide("profilePage");
    hide("listOfStudents");
    show("profile");
});

document.getElementById("closeProfessorForm").addEventListener("click", function () {
    hide("addNewProfessor");
});

//--------------------------------  Kreiranje studenata i profesora  -------------------------------------
var allStudent = (function () {

    var allStudents = locStorage.load("allStudent");
    if (allStudents == null) allStudents = {};

    var allProfessors = locStorage.load("allProfessors");
    if (allProfessors == null) allProfessors = {};

    document.getElementById("addNewStudent").addEventListener("click", function () {
        show("studentForm");
        hide("profilePage");
    });

    var Student = function (id, name, lastName, birthday, gender) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.birthday = birthday;
        this.gender = gender;
    };

    var createStudent = function () {
        var name = document.getElementById("studentName").value;
        var lastName = document.getElementById("studentLastname").value;
        var birthday = document.getElementById("birthday").value;
        var gender = document.querySelector('input[name="gender"]:checked').value;
        var id = name + lastName;

        return new Student(id, name, lastName, birthday, gender);
    };
    var addStudentToAllStudents = function name(id) {
        if (!allStudents[id] && document.querySelectorAll("require")) {
            allStudents[id] = createStudent();
            location.reload();
            return allStudents;
        }
        else console.log("this student already exist!");
    };
    document.getElementById("createStudent").addEventListener("click", function (e) {
        e.preventDefault();
        createStudent();
        addStudentToAllStudents(document.getElementById("studentName").value);
        locStorage.save("allStudent", allStudents);
        document.getElementById("addNewStudent").reset();
    });

    var Professor = function (id, name, lastName, birthday, pol, subject) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.birthday = birthday;
        this.pol = pol;
        this.subject = subject;
    };

    var createProfessor = function () {
        var id = document.getElementById("professorID").value;
        var name = document.getElementById("professorName").value;
        var lastName = document.getElementById("professorLastname").value;
        var birthday = document.getElementById("professorBirthday").value;
        var pol = document.querySelector('input[name="pol"]:checked').value;
        var subject = document.getElementById("professorSubject").value;
        return new Professor(id, name, lastName, birthday, pol, subject);
    };
    var addProfessorToAllProfessors = function name(id) {
        if (!allProfessors[id] && document.querySelectorAll("require")) {
            allProfessors[id] = createProfessor();
            return allProfessors;
        }
        else console.log("this Professor already exist!");
    };
    document.getElementById("createProfessor").addEventListener("click", function (e) {
        e.preventDefault();
        createProfessor();
        addProfessorToAllProfessors(document.getElementById("professorID").value);
        locStorage.save("allProfessor", allProfessors);
        document.getElementById("addNewProfessor").reset();
    });
}());

// -----------------------  tabela za Studente --------------------

var tableForStudentList = function () {

    var createTableHead = function (numberOfColumn, id) {
        // Table
        var table = document.createElement("table");
        table.setAttribute("id", "myTableStudents");
        document.getElementById("listOfStudents").appendChild(table);
        // Table head
        var tableHead = document.createElement("thead");
        tableHead.setAttribute("id", "studentsTableHead");
        table.appendChild(tableHead);
        var tbody = document.createElement("tbody");
        tbody.setAttribute("id", id);
        // Table row
        var headRow = document.createElement("tr");
        headRow.setAttribute("id", "studentsHeadRow")
        tableHead.appendChild(headRow);
        for (var collumnNumber = 0; collumnNumber < numberOfColumn; collumnNumber++) {
            var column = document.createElement("th");
            headRow.appendChild(column);
        }
        table.appendChild(tbody);
        return table;
    };
    // ovo popunjava zaglavlje. Prvi parametar je broj kolona, a u drugi prosledjujem niz u kome su podaci koji se upisuju u thead
    var writeTableHead = function (numberOfColumn, namesInArreyForThead) {
        var columnName = document.getElementById("studentsHeadRow").childNodes;
        for (var collumnNumber = 0; collumnNumber < numberOfColumn; collumnNumber++) {
            columnName[collumnNumber].textContent = namesInArreyForThead[collumnNumber];
        }
    };
    // Uzimanje iz localStorage-a.
    var tableData = function () {
        var allStudents = locStorage.load("allStudent");
        if (allStudents == null) allStudents = {};
        for (var id in allStudents) {
            var newRow = document.createElement("tr");
            for (var column in allStudents[id]) {
                var newColumn = document.createElement("td");
                newColumn.textContent = allStudents[id][column];
                newRow.appendChild(newColumn);

            document.getElementById("tableForStudentList").appendChild(newRow);
            }
            var del=document.createElement("th");
            del.setAttribute("id",allStudents,"_del");
            del.textContent="Delete";
            newRow.appendChild(del);
            var edit=document.createElement("th");
            edit.setAttribute("id",allStudents,"_edit");
            edit.textContent= "Edit";  
            newRow.appendChild(edit); 
        }
    };

    createTableHead(7, "tableForStudentList");
    writeTableHead(7, ["ID", "Student Name", "Student lastname", "Birthday", "Gender","Delete","Edit"]);
    tableData();

    document.getElementById("studentsList").addEventListener("click", function () {
        show("listOfStudents");
        hide("addNewProfessor");
        hide("subjects1");
        hide("addNewStudent");
        hide("profilePage");
        show("profile")
    });

};
tableForStudentList();

