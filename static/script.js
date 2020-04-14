$('#signup-button').on('click', handleSubmit);





async function handleSubmit(evt) {
  evt.preventDefault();

  const formData = {
    username: $('#username').val(),
    password: $('#password').val(),
    first_name: $('#firstname').val(),
    last_name: $('#lastname').val(),
    phone: $('#phone').val(),
  }

  const result = await axios.post('/auth/register', formData);

  window.localStorage.setItem('token', result.data.token);
  window.location.replace('/messages');

}



