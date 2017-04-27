import { parseHtml } from '../util/DOM-helper';
import Modal from './modal';

export default class SnippettBuilder {
  constructor(viewNode, templates, elements ) {
    // Use this.nodes to watch certain nodes
    this.nodes = {}
    this.layouts = templates || []; // Will fetch templates from server later. If empty allow local building.
    this.elements = elements || [];
    this.appNode = viewNode;

    this.modalForm = new Modal("<div class='modal-form-container' style='display: none;'><div class='modal-form'><a href='#'>&#10005;</a><div class='warn-msg' style='display: none;'>* Fields cannot be blank.</div><input type='text' placeholder='Name' name='name' /><textarea name='template' placeholder='Template. . .' ></textarea><button class='btn-submit'>ADD</button></div></div>");
  }

  start() {
    document.getElementsByTagName('body')[0].prepend(this.modalForm.template);

    this.renderNav();
    this.renderControlsPanel();
  }

  renderNav() {
    let nav = document.createElement('div');
    nav.id = 'snippett-nav';
    nav.classList.add('nav');
    this.appNode.append(nav);

    let addElButton = document.createElement('button');
    let elementBtnText = document.createTextNode('+ Element');

    addElButton.appendChild(elementBtnText);
    addElButton.setAttribute('data-list', 'elements');

    let addLayoutButton = document.createElement('button');
    let layoutBtnText = document.createTextNode('+ Layout');

    addLayoutButton.appendChild(layoutBtnText);
    addLayoutButton.setAttribute('data-list', 'layouts');

    nav.appendChild(addElButton);
    nav.appendChild(addLayoutButton);

    if(this.layouts) {
      let layoutUl = document.createElement('ul');
      layoutUl.id = "layout-nav";

      this.nodes.layoutUl = layoutUl;

      nav.appendChild(layoutUl);

      this.renderLayoutsList()
    }

    if(this.elements) {
      let elementUl = document.createElement('ul');
      elementUl.id = "element-nav";

      this.nodes.elemUl = elementUl;

      nav.appendChild(elementUl);

      this.renderElementsList();
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

  renderControlsPanel() {
    let controlPanel = document.createElement('div');
    controlPanel.classList.add('control-panel');

    this.appNode.appendChild(controlPanel);

  }

  renderLayoutsList() {
    for(let key in this.layouts){
      let li = document.createElement('li');
      let link = document.createElement('a');
      let linkText = document.createTextNode(key);

      link.href = "#";
      link.setAttribute('data-id', key);
      link.setAttribute('data-list', 'layouts');
      link.appendChild(linkText);

      li.appendChild(link);

      this.nodes.layoutUl.appendChild(li);
    }
  }

  renderElementsList() {
    for(let key in this.elements){
      let li = document.createElement('li');
      let link = document.createElement('a');
      let linkText = document.createTextNode(key);

      link.href = "#";
      link.setAttribute('data-id', key);
      link.setAttribute('data-list', 'elements');
      link.appendChild(linkText);

      li.appendChild(link);

      this.nodes.elemUl.appendChild(li);
    }
  }

  renderElement(id) {
    let contentBody = document.getElementsByClassName('content-box')[0];
    let content = parseHtml(this.elements[id]);

    contentBody.appendChild(content);
  }

  openModalForm(destination) {
    this.modalForm.open();

    let clickHandler = (e) => {
      e.preventDefault();
      
      if(e.target.nodeName === "BUTTON") {
        let formData = this.modalForm.getFieldValues();

        if(!this.modalForm.empty()){
          if(destination === "layouts") {
            this.addLayout(formData);
          } else if (destination === "elements") {
            this.addElement(formData);
          }

          this.modalForm.off('click', clickHandler);
          this.modalForm.close();
        } else {
          this.modalForm.showWarnMsg();
        }

      } else if (e.target.nodeName === 'A' || e.target.classList.contains('modal-form-container')) {
        this.modalForm.off('click', clickHandler);
        this.modalForm.close();
      }
    }

    this.modalForm.on('click', clickHandler);

  }

  addLayout(data) {
    this.layouts = [...this.layouts, data];

    this.renderLayoutsList()
  }

  addElement(data) {
    this.elements = [...this.elements, data];

    this.renderElementsList();
  }

  closeModalForm() {
    this.modalForm.close()
  }

  clearContentBoxes() {
    let contentBoxes = document.getElementsByClassName('content-box');

    for (let i = 0; i < contentBoxes.length; i++) {
      contentBoxes[i].innerHTML = "";
    }
  }

  renderLayout(id) {
    if(!id) {
      this.appNode.innerHTML = this.layouts.default_layout;
    } else {
      this.appNode.innerHTML = this.layouts[id];
    }

    this.insertContentBoxes(this.appNode);
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
