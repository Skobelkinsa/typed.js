import defaults from './defaults.js';

export default class Initializer {
  load(self, options, elementId) {
    // chosen element to manipulate text
    self.el = document.getElementById(elementId);

    self.options = {};
    Object.keys(defaults).forEach((key) => {
      self.options[key] = defaults[key];
    });
    Object.keys(options).forEach((key) => {
      self.options[key] = options[key];
    });

    // attribute to type into
    self.isInput = self.el.tagName.toLowerCase() === 'input';
    self.attr = self.options.attr;
    self.bindInputFocusEvents = self.options.bindInputFocusEvents;

    // show cursor
    self.showCursor = self.isInput ? false : self.options.showCursor;

    // custom cursor
    self.cursorChar = self.options.cursorChar;

    // Is the cursor blinking
    self.cursorBlinking = true;

    // text content of element
    self.elContent = self.attr ? self.el.getAttribute(self.attr) : self.el.textContent;

    // html or plain text
    self.contentType = self.options.contentType;

    // typing speed
    self.typeSpeed = self.options.typeSpeed;

    // add a delay before typing starts
    self.startDelay = self.options.startDelay;

    // backspacing speed
    self.backSpeed = self.options.backSpeed;

    // amount of time to wait before backspacing
    self.backDelay = self.options.backDelay;

    // Fade out instead of backspace
    self.fadeOut = self.options.fadeOut;
    self.fadeOutClass = self.options.fadeOutClass;
    self.fadeOutDelay = self.options.fadeOutDelay;

    // input strings of text
    self.strings = self.options.strings;

    // character number position of current string
    self.strPos = 0;

    // current array position
    self.arrayPos = 0;

    // number to stop backspacing on.
    // default 0, can change depending on how many chars
    // you want to remove at the time
    self.stopNums = [];

    // Looping logic
    self.loop = self.options.loop;
    self.loopCount = self.options.loopCount;
    self.curLoop = 0;

    // shuffle the strings
    self.shuffle = self.options.shuffle;
    // the order of strings
    self.sequence = [];

    self.pause = {
      status: false,
      typewrite: true,
      curString: '',
      curStrPos: 0
    }

    // When the typing is complete (when not looped)
    self.typingComplete = false;

    // div containing strings
    self.stringsElement = document.getElementById(self.options.stringsElement);

    if (self.stringsElement) {
      self.strings = [];
      self.stringsElement.style.display = 'none';
      var strings = Array.prototype.slice.apply(self.stringsElement.children);
      for (let s of strings) {
        self.strings.push(s.innerHTML);
      }
    }

    // Set the order in which the strings are typed
    for (let i in self.strings) {
      self.sequence[i] = i;
    }

    // Using the `~12` syntax, set each string's stop number
    // (stops backspacing at a certain digit)
    this.setStopNums(self);

    // If there is some text in the element
    self.currentElContent = this.getCurrentElContent(self);
  }

  setStopNums(self) {
    for (let s in self.strings) {
      const string = self.strings[s];
      const newStopNum = string.split('~')[1];
      if (newStopNum && newStopNum > 0) {
        const regex = /~(\d+)/g;
        self.strings[s] = string.replace(regex, '');
        self.stopNums.push(parseInt(newStopNum));
      }
      else {
        self.stopNums.push(0);
      }
    }
  }

  getCurrentElContent(self) {
    let elContent = '';
    if (self.attr) {
      elContent = self.el.getAttribute(self.attr);
    }
    else if (self.isInput) {
      elContent = self.el.value;
    }
    else if (self.contentType === 'html') {
      elContent = self.el.innerHTML;
    }
    else {
      elContent = self.el.textContent;
    }
    return elContent;
  }
}

export let initializer = new Initializer();
