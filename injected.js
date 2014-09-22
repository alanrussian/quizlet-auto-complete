var AUTOCOMPLETE_GHOST_TEXT_CLASS = "autocompleteGhostText";

var autocomplete = new Autocomplete();

/**
 * Makes page controls reusable for the inline and regular editing page.
 */
var PageControls = function(functions, textarea) {
  var definition;

  this.textarea = $(textarea);

  $.extend(this, functions);

  this.setDefinition = function(def) {
    definition = def;
  }

  this.getDefinition = function() {
    return definition;
  }

  this.init();
};

var inlinePageControls = {
  init: function() {
    this.textSizerElement = this.textarea.parent().siblings(".the-text");
    this.ghostTextElement = $("<textarea>")
        .addClass(AUTOCOMPLETE_GHOST_TEXT_CLASS)
        .insertBefore(this.textarea);
  },

  getWord: function() {
    return this.textarea.closest(".text").find(".qWordTextarea").val();
  },

  adjustTextboxSizeToGhostText: function(ghostText) {
    this.textSizerElement.text(ghostText);
  },

  setGhostText: function(text) {
    this.ghostTextElement.val(text);
    this.adjustTextboxSizeToGhostText(text);
  },

  setGhostTextVisible: function(visible) {
    this.ghostTextElement.toggle(visible);
  },

  getText: function() {
    return this.textarea.val();
  },

  setText: function(text) {
    this.textarea.val(text);
  }
};

var onGetDefinitionsSuccess = function(definitions, pageControls) {
  var enteredText = pageControls.getText();
  var autocompleteMatch = definitions.findAutocompleteMatch(enteredText);
  pageControls.setDefinition(autocompleteMatch);

  var ghostText =
      enteredText + (autocompleteMatch == null ? "" : autocompleteMatch.substr(enteredText.length));
  pageControls.setGhostText(ghostText);
};

var updateAutocomplete = function(element, functions) {
  var pageControls = element.data("pageControls");
  if (pageControls == null) {
    pageControls = new PageControls(functions, element);
    element.data("pageControls", pageControls);
  }

  // Only replace up to characters typed because otherwise text weights would be strange since ghost
  // text makes regular text bolder.
  // TODO: Remove flash of smaller height.
  var enteredText = pageControls.getText();
  var definitionText = pageControls.getDefinition();
  var ghostText =
      enteredText + (definitionText == null ? "" : definitionText).substr(enteredText.length);
  pageControls.setGhostText(ghostText);
  pageControls.setGhostTextVisible(true);

  autocomplete.getDefinitions(
    pageControls.getWord(),
    function(definitions) {
      onGetDefinitionsSuccess(definitions, pageControls);
    });
};

var saveAutocomplete = function(pageControls) {
  var pageControls = $(this).data("pageControls");

  var autocompleteDefinition = pageControls.getDefinition();
  if (autocompleteDefinition == null) {
    return;
  }

  pageControls.setText(autocompleteDefinition);
};

$(function() {
  $(".text")
      .on("keyup focus", ".qDefTextarea", function() {
        updateAutocomplete($(this), inlinePageControls);
      })
      .on("blur", ".qDefTextarea", saveAutocomplete);
});