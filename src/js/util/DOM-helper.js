// Parses html string into DOM Node
export function parseHtml(htmlString) {
  var wrapper = document.createElement('div');
  wrapper.innerHTML = htmlString;

  return wrapper.firstChild;
};

// Returns the innermost node in the DOM tree
export function innerNodeOf(node) {
};
