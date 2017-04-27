import { parseHtml } from '../util/DOM-helper';

export default class Modal {
  constructor(template) {
    this.template = parseHtml(template);
    this.eventListeners = [];
  }

  open() {
    this.template.style.display = "";
  }

  close() {
    this.clearForm();
    this.template.style.display = "none";
  }

  registerListener(event, target, handler) {
    if (handler) {
      this.eventListeners.push({event, target, handler});
    } else {
      let handler = target;
      this.eventListeners.push({event, handler});
    }
  }

  unregisterListener(event, handler) {
    for(let i = 0; i < this.eventListeners.length; i++) {
      if(this.eventListeners[i].event === event && this.eventListeners[i].handler === handler) {
        if(this.eventListeners[i].target) {
          this.eventListeners[i].target.removeEventListener(event, handler);
        } else {
          this.template.removeEventListener(event, handler);
        }
        this.eventListeners.splice(i, 1);
      }
    }
  }

  on(event, target, handler) {
    if(handler) {
      let node = this.template;

      if(/^[.]/.test(target)) {
        let className = target.replace(/[.]/, '');

        let nodes = this.template.getElementsByClassName(className);

        for(let i=0; i < nodes.length; i++) {
          nodes[i].addEventListener(event, handler);
          this.registerListener(event, nodes[i], handler);
        }
      } else if (/^[#]/.test(target)) {
        let id = target.replace(/[#]/, '');
        let node = this.template.getElementById(id);

        node.addEventListener(event, handler);
        this.registerListener(event, handler);
      } else {
        let tagName = target;
        let nodes = this.template.getElementsByTagName(tagName);

        for(let i = 0; i < nodes.length; i++) {
          nodes[i].addEventListener(event, handler);
          this.registerListener(event, nodes[i], handler);
        }
      }
    } else {
      let handler = target;
      
      this.template.addEventListener(event, handler);
      this.registerListener(event, handler);
    }
  }

  off(event, handler) {
    this.unregisterListener(event, handler);
  }

  getFieldValues () {
    let inputFields = this.template.getElementsByTagName('input');
    let textareaFields = this.template.getElementsByTagName('textarea');
    let data = {};

    if(inputFields) {
      for(let i = 0; i < inputFields.lenth; i++) {
        let fieldName = inputFields[i].getAttribute('name');
        let value = inputFields[i].value;

        data[fieldName] = value;
      }
    }

    if(textareaFields) {
      for(let i = 0; i < textareaFields.length; i++) {
        let fieldName = textareaFields[i].getAttribute(name);
        let value = textareaFields[i].value;

        data[fieldName] = value;
      }
    }

    return data
  }

  empty() {
    let values = this.getFieldValues();

    for(let v in values) {
      if(values[v] === '') {
        return true
      }
    }

    return false;
  }

  clearForm() {
    let inputs = this.template.getElementsByTagName('input');
    let textareas = this.template.getElementsByTagName('textarea');

    if(inputs) {
      for(let i = 0; i < inputs.length; i++) {
        inputs[i].value = '';
      }
    }

    if(textareas) {
      for(let i = 0; i < textareas.length; i++) {
        textareas[i].value = '';
      }
    }
  }
}

/*
{
  template: parseHtml("<div class='modal-form-container' style='display: none;'><div class='modal-form'><a href='#'>&#10005;</a><div class='warn-msg' style='display: none;'>* Fields cannot be blank.</div><input type='text' placeholder='Name' name='name' /><textarea name='template' placeholder='Template. . .' ></textarea><button class='btn-submit'>ADD</button></div></div>"),
  open: function() {
    this.template.style.display = "";
  },
  close: function() {
    this.clearForm();
    this.hideWarnMsg();
    this.template.style.display = "none";

  },
  init: function() {
    document.getElementsByTagName('body')[0].prepend(this.template);
  },
  listeners: [],
  registerListener: function(event, handler) {
    this.listeners.push({event, handler});
  },
  unregisterListener: function(event, handler) {
    let listener;
    for(let i = 0; i < this.listeners.length; i++) {
      if(this.listeners[i].event === event && this.listeners[i].handler === handler ) {
        this.template.removeEventListener(event, handler);
        this.listeners.splice(0, i);
      }
    }
  },
  on: function(event, handler) {
    this.template.addEventListener(event, handler);
    this.registerListener(event, handler);
  },
  off: function(event, handler) {
    this.unregisterListener(event, handler);
  },
  getFieldValues: function () {
    let inputValue = this.template.getElementsByTagName('input')[0].value;
    let textAreaValue = this.template.getElementsByTagName('textarea')[0].value;

    return { name: inputValue, template: textAreaValue }
  },
  empty: function() {
    let {name, template} = this.getFieldValues();

    if( !name.length || !template.length ) {
      return true;
    }
    return false;
  },
  showWarnMsg: function() {
    this.template.getElementsByClassName('warn-msg')[0].style.display = 'block';
  },
  hideWarnMsg: function() {
    this.template.getElementsByClassName('warn-msg')[0].style.display = 'none';
  },
  clearForm: function() {
    this.template.getElementsByTagName('input')[0].value = "";
    this.template.getElementsByTagName('textarea')[0].value = "";
  }
};
*/
