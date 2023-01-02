import bot from './assets/bot.svg';
import user from './assets/user.svg';

const btn = document.querySelector('.btn');
const code = document.querySelector('.codes');
const btn1 = document.querySelector('.btn1');
const clean = document.querySelector('.cleanCode');
const explain = document.querySelector('.explainCode');
const form = document.querySelector('form');
const chat = document.querySelector('.chatContainer');
// popup
btn.addEventListener('click', () => {
  clean.innerHTML = `
  <p class="re-write">TO use the clean code you need to use the prompt<span>"re-rewrite this code <strong><i>PASTE YOUR CODE HERE...</strong></i></span>" 
  </p>
  <p>USE MAMBO FOR:</p>
  <P>Faster execution and performance of your code.<br>
  Improved readability and maintainability of your code. <br>
  
  Reduction of  bugs and errors <br>
  
  Better user experience <br>
  
  Professional code.<p/> `;
});

btn1.addEventListener('click', () => {
  explain.innerHTML = `
  <p class="re-write">TO use the explain code you need to use the prompt<span>"Explain this code <strong><i>PASTE YOUR CODE HERE...</strong></i></span>" 
  </p>
  <p>USE MAMBO FOR:</p>
  <P>Faster execution and performance of your code.<br>
  Improved readability and maintainability of your code. <br>
  
  Reduction of  bugs and errors <br>
  
  Better user experience <br>
  
  Professional code.<p/>`;
});

// loading

let loadInterval;

function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    // Update the text content of the loading indicator
    element.textContent += '.';

    // If the loading indicator has reached three dots, reset it
    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

// generate a uniqueId

function generateId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

// generate the chat stripe

function chatStrip(isAI, value, uniqueId) {
  return `
    <div class="wrapper ${isAI && 'ai'}">
        <div class="chat">
            <div class="profile">
                <img 
                  src=${isAI ? bot : user} 
                  alt="${isAI ? 'bot' : 'user'}" 
                />
            </div>
            <div class="message" id=${uniqueId}>${value}</div>
        </div>
    </div>
`;
}

// handle the submit

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  chat.innerHTML += chatStrip(false, data.get('prompt'));

  form.reset();

  const uniqueId = generateId();

  chat.innerHTML += chatStrip(true, '...', uniqueId);

  chat.scrollTop = chat.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  const response = await fetch('http://localhost:5000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: data.get('prompt'),
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.json();
    messageDiv.innerHTML = 'something went wrong';

    alert(err);
  }
};

// call handleSubmit

if (form) {
  form.addEventListener('submit', handleSubmit);
  // submit event with enter key

  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  });
}
