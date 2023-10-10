const inputSlider = document.querySelector("[len_slider]"); // fetching using cutom Attribute
const copybtn = document.querySelector("[copy_button]");
const copymsg = document.querySelector("[copy_pw]");
const length_display = document.querySelector("[pw_len]");
const upper = document.querySelector("#uppercase");
const lower = document.querySelector("#lowercase");
const num = document.querySelector("#nubmers");
const symbol = document.querySelector("#Symbols");
const ind = document.querySelector("[indicator]");
const genbtn = document.querySelector("[gen_pw]");
const allcheckbox = document.querySelectorAll("input[type=checkbox]"); // this will include all input tags in which the type is checkbox.
const passwordDisplay = document.querySelector("[disp_pw]");
// to generate random symbols we can first put all sybmols in a string and random pick the index value and take the symbol at that particular index value, in this way
// we took sybmols randomly.
const symbolstring = '~`!@#$%^&*()_-+={[}]|:;/"<,>.?/';

let password = "";
let passwordlen = 10;
let checkCount = 0;
// set circle color to grey
setIndicator("#ccc");
// setting passwordlength with slider
function handleSlider() {
  // setting default value
  inputSlider.value = passwordlen; // this for slider, setting default position of slider.
  //input tag has an attribute value, with this we can set the intial value of slider, when page reloads, slider will at that value.
  //   For other input types like type="text", type="number", type="checkbox", and so on, the value attribute is commonly used to set the
  // initial value of the input field when the page loads. Users can modify the input value, and JavaScript can be used to access and manipulate the value attribute dynamically.
  length_display.innerText = passwordlen; // this is for length display.
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordlen - min) * 100) / (max - min) + "% 100%";
}
handleSlider(); // function is call to set the intial values of slider position and pw length display.
function setIndicator(color) {
  ind.style.backgroundColor = color;
  ind.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
function getRandomInt(max, min) {
  return Math.floor(Math.random() * (max - min)) + min;
  // math.random() generators number between 0 and 1, to generate btw our max and min val
  //we first multiplied it with the diff of max and min, and the result can be a float, therefore we rounded it off using floor function, and then added min value.
  //Math.random() * (maxval - minval) will generate a number which is between 0 to max-min, and we want a nubmer btw min and max, therefore we add min to both side i.e at 0 and at max-min
  //now the range is =  min-max, therefore we added min val.
}
function generateRandomNumber() {
  return getRandomInt(0, 9);
}
function generateLowerCaseLetter() {
  return String.fromCharCode(getRandomInt(97, 123)); // passing ascii value of a and z
}
function generateUpperCaseLetter() {
  return String.fromCharCode(getRandomInt(65, 91));
}

function generateSymbol() {
  const random_num = getRandomInt(0, symbolstring.length);
  return symbolstring.charAt(random_num);
}
function calcStrength() {
  let hasupper = false;
  let haslower = false;
  let hasnum = false;
  let hassymbol = false;
  if (upper.checked) {
    hasupper = true;
  }
  // .checked whehter the box is checked or not
  if (lower.checked) {
    haslower = true;
  }
  if (num.checked) {
    hasnum = true;
  }
  if (symbol.checked) {
    hassymbol = true;
  }
  if (hasupper && haslower && (hasnum || hassymbol) && passwordlen >= 8) {
    setIndicator("#0f0");
  } else if (
    (haslower || hasupper) &&
    (hasnum || hassymbol) &&
    passwordlen >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}
async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value); // this usese clipboard api to copy text in clipboard
    //writeText returns a promise, either it will be resolve or reject.
    copymsg.innerText = "Copied";
  } catch (e) {
    copymsg.innerText("failed");
  }
  // to make copy span visible
  copymsg.classList.add("active");
  //active is a class in css
  //now to make it invisible after 2s
  setTimeout(() => {
    copymsg.classList.remove("active");
  }, 2000);
}

inputSlider.addEventListener("input", (e) => {
  passwordlen = e.target.value;
  handleSlider();
  console.log("slider working");
});

copybtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});
function countCheckBoxes() {
  checkCount = 0;
  allcheckbox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });
  //special condition - agr password ke length is less than checkcount, then make password length equal to checkcount
  if (checkCount > passwordlen) {
    passwordlen = checkCount;
    handleSlider();
  }
  console.log("pw checked");
}
allcheckbox.forEach((checkbox) => {
  checkbox.addEventListener("change", countCheckBoxes);
});
//shuffle password as needed by genbtn event listner
function shufflePassword(array) {
  //fisher yates mehtod --> this algorithm is used for shuffling
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // will generate random number between 0 - (i+1), where 0 is inclusive and i+1 is exclusive.
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  console.log("shuffling working");
  return str;
}
genbtn.addEventListener("click", () => {
  //none of the checkbox is selected
  if (checkCount == 0) {
    return;
  }
  if (passwordlen < checkCount) {
    passwordlen = checkCount;
    handleSlider();
  }
  //making password string empty, so that previously generated password can be removed and new one can be created
  password = "";
  // creating function array
  let funarr = [];
  if (upper.checked) {
    funarr.push(generateUpperCaseLetter); // dont write generateUpperCaseLetter() , this we call the function and return the resultant value
  }
  if (lower.checked) {
    funarr.push(generateLowerCaseLetter);
  }
  if (num.checked) {
    funarr.push(generateRandomNumber);
  }
  if (symbol.checked) {
    funarr.push(generateSymbol);
  }
  //compulsory addition
  for (let i = 0; i < funarr.length; i++) {
    password += funarr[i]();
  }
  //remaing addition
  for (let i = 0; i < passwordlen - funarr.length; i++) {
    let randind = getRandomInt(0, funarr.length); // will generate reandom indexes for funarr
    password += funarr[randind]();
  }
  // shuffling the password
  password = shufflePassword(Array.from(password));
  passwordDisplay.value = password;
  calcStrength();
});
