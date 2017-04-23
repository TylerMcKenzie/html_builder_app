import { parseHtml } from '../util/DOM-helper';

export default class SnippettBuilder {
  constructor(viewNode, templates, elements ) {
    this.templates = templates || []; // Will fetch templates from server later. If empty allow local building.
    this.elements = elements || [];
    this.viewNode = viewNode;

    this.modalForm = {
      template: parseHtml("<div class='modal-form-container' style='display: none;'><div class='modal-form'><a href='#'>&#10005;</a><div class='warn-msg' style='display: none;'>* Fields cannot be blank.</div><input type='text' placeholder='Name' name='name' /><textarea name='template' placeholder='Template. . .' ></textarea><button class='btn-submit'>ADD</button></div></div>"),
      open: function() {
        this.template.style.display = "";
      },
      close: function() {
        this.template.getElementsByTagName('input')[0].value = "";
        this.template.getElementsByTagName('textarea')[0].value = "";
        this.template.getElementsByClassName('warn-msg')[0].style.display = 'none';
        this.template.style.display = "none";

      },
      init: function() {
        document.getElementsByTagName('body')[0].prepend(this.template);
      },
      on: function(event,  handler) {
        this.template.addEventListener(event, handler);
      },
      getFieldValues: function () {
        let inputValue = this.template.getElementsByTagName('input')[0].value;
        let textAreaValue = this.template.getElementsByTagName('textarea')[0].value;

        return { name: inputValue, template: textAreaValue }
      },
      empty: function() {
        let inputValue = this.template.getElementsByTagName('input')[0].value;
        let textAreaValue = this.template.getElementsByTagName('textarea')[0].value;

        if( !inputValue.length || !textAreaValue.length ) {
          return true;
        }
        return false;
      },
      warn: function() {
        let warnMsg = this.template.getElementsByClassName('warn-msg')[0];

        warnMsg.style.display = 'block';
      }
    };

  }

  start() {
    this.modalForm.init();
    this.renderTemplateNav();
    this.renderLayout();
  }

  renderTemplateNav() {
    let nav = document.getElementById('snippett-nav');

    let addElButton = document.createElement('button');
    let addLayoutButton = document.createElement('button');
    let elementBtnText = document.createTextNode('+ Element');
    let layoutBtnText = document.createTextNode('+ Layout');

    addElButton.appendChild(elementBtnText);
    addElButton.setAttribute('data-list', 'elements');
    addLayoutButton.appendChild(layoutBtnText);
    addLayoutButton.setAttribute('data-list', 'layouts');

    nav.appendChild(addElButton);
    nav.appendChild(addLayoutButton);



    let layoutUl = document.createElement('ul');
    let elementUl = document.createElement('ul');

    layoutUl.id = "layout-nav";
    elementUl.id = "element-nav";

    nav.appendChild(layoutUl);
    nav.appendChild(elementUl);

    if(this.templates) {

      for(let key in this.templates){
        let li = document.createElement('li');
        let link = document.createElement('a');
        let linkText = document.createTextNode(key);

        link.href = "#";
        link.setAttribute('data-id', key);
        link.setAttribute('data-list', 'layouts');
        link.appendChild(linkText);

        li.appendChild(link);

        layoutUl.appendChild(li);
      }

      for(let key in this.elements){
        let li = document.createElement('li');
        let link = document.createElement('a');
        let linkText = document.createTextNode(key);

        link.href = "#";
        link.setAttribute('data-id', key);
        link.setAttribute('data-list', 'elements');
        link.appendChild(linkText);

        li.appendChild(link);

        elementUl.appendChild(li);
      }

    }


    nav.addEventListener('click', (e) => {
      e.preventDefault();

      if(e.target.nodeName === "LI") {
        let a =  e.target.firstChild;
        let id = a.getAttribute('data-id');
        let listDest = a.getAttribute('data-list');

        if(listDest === "layouts") {
          this.renderLayout(id);
        } else {
          this.renderElement(id);
        }
      } else if(e.target.nodeName === "A") {
        let a =  e.target;
        let id = a.getAttribute('data-id');
        let listDest = a.getAttribute('data-list');

        if(listDest === "layouts") {
          this.renderLayout(id);
        } else {
          this.renderElement(id);
        }
      } else if(e.target.nodeName === "BUTTON") {
        let button = e.target;
        let dest = button.getAttribute('data-list');

        if(dest === 'layouts') {
          this.openModalForm(dest);
        } else {
          this.openModalForm(dest);
        }
      }
    });
  }

  renderElement(id) {
    let contentBody = document.getElementsByClassName('content-box')[0];
    let content = parseHtml(this.elements[id]);

    contentBody.appendChild(content);
  }

  openModalForm(destination) {
    this.modalForm.open();

    this.modalForm.on('click', (e) => {
      if(e.target.nodeName === "BUTTON") {
        let formData = this.modalForm.getFieldValues();

        if(!this.modalForm.empty()){
          if(destination === "layouts") {
            this.addLayout(formData);
          } else if (destination === "elements") {
            this.addElement(formData);
          }

          this.modalForm.close();
        } else {
          this.modalForm.warn();
        }

      } else if (e.target.nodeName === 'A' || e.target.classList.contains('modal-form-container')) {
        this.modalForm.close();
      }
    })
  }

  addLayout(data) {
    this.templates = [...this.templates, data];
    console.log(this.templates)
  }

  addElement(data) {
    this.elements = [...this.elements, data];
    console.log(this.elements)
  }

  closeModalForm() {
    this.modalForm.close()
  }

  clearContent() {
    let contentBoxes = document.getElementsByClassName('content-box');

    for (let i = 0; i < contentBoxes.length; i++) {
      contentBoxes[i].innerHTML = "";
    }
  }

  renderLayout(id) {
    if(!id) {
      this.viewNode.innerHTML = this.templates.default_layout;
    } else {
      this.viewNode.innerHTML = this.templates[id];
    }

    this.insertContentBoxes(this.viewNode);
  }

  insertContentBoxes(layoutNode) {
  	let children = layoutNode.children;

    if(children.length) {
      for(let i = 0; i < children.length; i++) {
        if(children[i].nodeType === 1) {
       		if(children[i].children.length) {
            this.insertContentBoxes(children[i]);
          } else {
      			children[i].innerHTML = `<div class='content-box' data-js='box-${i}'></div>`;
          }
      	}
       }
     } else {
      layoutNode.innerHTML = `<div class='content-box' data-js='box-0'></div>`;
    }
  }
}
