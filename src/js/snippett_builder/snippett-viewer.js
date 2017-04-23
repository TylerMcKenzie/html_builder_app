import { parseHtml } from '../util/DOM-helper';

export default class SnippettBuilder {
  constructor(templates, elements, viewNode) {
    this.templates = templates || []; // Will fetch templates from server later. If empty allow local building.
    this.elements = elements;
    this.viewNode = viewNode;
  }

  start() {
    this.renderTemplateNav();
    this.renderLayout();
  }

  renderTemplateNav() {
    let nav = document.getElementById('snippett-nav');

    if(this.templates.length > 0) {
      let layoutUl = document.createElement('ul');
      let elementUl = document.createElement('ul');

      layoutUl.id = "layout-nav";
      elementUl.id = "element-nav";

      nav.appendChild(layoutUl);
      nav.appendChild(elementUl);

      for(let key in this.templates){
        let li = document.createElement('li');
        let link = document.createElement('a');
        let linkText = document.createTextNode(key);

        link.href = "#";
        link.setAttribute('data-id', key);
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
        link.appendChild(linkText);

        li.appendChild(link);

        elementUl.appendChild(li);
      }

    } else {
      
    }

    nav.addEventListener('click', (e) => {
      e.preventDefault();

      if(e.target.nodeName === "LI") {
        let a =  e.target.firstChild;
        let id = a.getAttribute('data-id');

        if(e.target.parentNode.id === "layout-nav") {
          this.renderLayout(id);
        } else {
          this.renderElement(id);
        }
      } else if(e.target.nodeName === "A") {
        let a =  e.target;
        let id = a.getAttribute('data-id');

        if(e.target.parentNode.parentNode.id === "layout-nav") {
          this.renderLayout(id);
        } else {
          this.renderElement(id);
        }
      }
    });
  }

  renderElement(id) {
    let contentBody = document.getElementsByClassName('content-box')[0];
    let content = parseHtml(this.elements[id]);

    contentBody.appendChild(content);
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
