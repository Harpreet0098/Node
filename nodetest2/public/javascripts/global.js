var userListArray = [];

$(document).ready(function(){
  populateTable();
  // User Link Click
  $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
  // Add user button event handler
  $('#btnAddUser').on('click', addUser);
  $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteuser);
});

/* Populate the table with the User list*/
function populateTable(){
  var tableContent = '';
  $.getJSON('/users/userlist', function(data){
    userListArray = data;
    $.each(data, function(){
        tableContent += '<tr>';
        tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
        tableContent += '<td>' + this.email + '</td>';
        tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
        tableContent += '</tr>';
    });

    $('#userList table tbody').html(tableContent);
  });
};

/* Show User Info */
function showUserInfo(event){
  // Prevent the link from firing
  event.preventDefault();
  //Retrieve UserName from the link rel attribute
  var thisUserName = $(this).attr('rel');
  // Get Index of object based on id value
  var arrayPosition = userListArray.map(function(arrayItem){
    return arrayItem.username;
  }).indexOf(thisUserName);
  // Get our User object
  var thisUserObject = userListArray[arrayPosition];
  //populate Info Box
  $('#userInfoName').text(thisUserObject.fullname);
  $('#userInfoAge').text(thisUserObject.age);
  $('#userInfoGender').text(thisUserObject.gender);
  $('#userInfoLocation').text(thisUserObject.location);
};

/* Add User Form*/
function addUser(event){
  event.preventDefault();
  //counter to keep track of blank fields
  var errorCount = 0;
  $("#addUser input").each(function(index, val){
    if ($(this).val() === ''){
      errorCount ++;
    }
  });
  // If count is equal to 0, put it in object
  if (errorCount === 0){
      var newUser = {
        'username' : $('#addUser fieldset input#inputUserName').val(),
        'email' : $('#addUser fieldset input#inputUserEmail').val(),
        'fullname' : $('#addUser fieldset input#inputUserFullname').val(),
        'age' : $('#addUser fieldset input#inputUserAge').val(),
        'location' : $('#addUser fieldset input#inputUserLocation').val(),
        'gender' : $('#addUser fieldset input#inputUserGender').val()
      }
    //Post the newUser object using Ajax
      $.ajax({
        type: 'POST',
        data : newUser,
        url: '/users/adduser',
        dataType: 'JSON'
      }).done(function(response){
          // check for successful (blank) response
          if (response.msg === ''){
            $('#addUser fieldset input').val();
            //update the table
            populateTable();
          }
          else {
            alert('ERROR: ' + response.msg);
          }
      });
  }
  else {
    // if count is not equal to 0.
    alert('Fill in all the fields');
    return false;
  }
};

function deleteuser(event){
  event.preventDefault();

  //Confirmation Box
  var Confirmation = confirm('Are you sure?');

  if (Confirmation == true){
    //if true, deleteuser
    $.ajax({
      type: 'DELETE',
      url: '/users/deleteuser/' + $(this).attr('rel')
    }).done(function(response){
      if (response.msg === ''){}
      else {
        alert('ERROR:' + response.msg);
      }
      // Update table
        populateTable();
    });
  }
  else {
    // if said 'no'
    return false;
  }
};
