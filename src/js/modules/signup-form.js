// Lead Form - Mailchimp
export function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

export function getCookie(cname) {
  const name = `${cname}=`;
  Array.prototype.map(document.cookie.split(';'), (item) => {
    let c = item;
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    return (c.indexOf(name) === 0 ? c.substring(name.length, c.length) : false);
  });
  return '';
}

const runForm = (template) => {
  const compiled = template();
  const d = document.createElement('div');
  d.innerHTML = compiled;
  document.body.appendChild(d.firstChild);

  const signUpFormContainerElem = document.getElementById('signup-form-container');
  const closeFormElem = document.getElementById('close-form');
  const signUpFormWrapperElem = document.getElementById('signup-form-wrapper');
  const submit = document.getElementById('submit-form');
  const signUpForm = document.getElementById('signup-form');
  const signUpResponse = document.getElementById('signup-response');

  setTimeout(() => (signUpFormContainerElem.classList.remove('hide')), 300);

  signUpFormContainerElem.addEventListener('click', (event) => {
    event.stopPropagation();
    event.currentTarget.classList.add('hide');
    setCookie('signUpFormSession', true);
  }, false);

  closeFormElem.addEventListener('click', (event) => {
    event.stopPropagation();
    event.currentTarget.parentElement.parentElement.classList.add('hide');
    setCookie('signUpFormSession', true);
  }, false);

  signUpFormWrapperElem.addEventListener('click', event => (event.stopPropagation()), false);

  submit.addEventListener('click', (event) => {
    event.preventDefault();
    const data = {
      EmailAddress: document.getElementById('email-address').value,
      FirstName: document.getElementById('first-name').value,
      LastName: document.getElementById('last-name').value,
    };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/signupform/signup', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.response);
          if (response.status === 'success') {
            document.querySelector('.email-validation-error').classList.add('hide');
            signUpForm.classList.add('hide');
            signUpResponse.classList.remove('hide');
            signUpResponse.firstElementChild.classList.remove('hide');
            setCookie('BaliListMember', true, 180);
            setTimeout(() => (document.body.removeChild(signUpFormContainerElem)), 5000);
          } else if (response.status === 'validation error') {
            document.querySelector('.email-validation-error').classList.remove('hide');
          }
        } else {
          signUpForm.classList.add('hide');
          signUpResponse.classList.remove('hide');
          signUpResponse.lastElementChild.classList.remove('hide');
          setCookie('signUpFormSession', true);
          setTimeout(() => (document.body.removeChild(signUpFormContainerElem)), 5000);
        }
      }
    };
    xhr.send(JSON.stringify(data));
  }, false);
};

export default {
  runForm,
};
