var DEFINITIONS_URL = "https://quizlet.com/create-set/autodefine";
var WORD_LANGUAGE = "en";
var DEFINITION_LANGUAGE = "en";
var AUTOCOMPLETE_GHOST_TEXT_CLASS = "autocompleteGhostText";

// TODO: Handle error.
// TODO: Cache results.
var getDefinitions = function(word, onSuccess) {
  $.getJSON(
      DEFINITIONS_URL,
      {
        text: word,
        wordLang: WORD_LANGUAGE,
        defLang: DEFINITION_LANGUAGE
      },
      function(data) {
        onSuccess(data.definitions);
      });
};

var onGetDefinitionsSuccess = function(
    definitions,
    textSizerElement,
    definitionElement,
    autocompleteGhostTextElement) {

  if (definitions.length) {
    // TODO: Show relevant results.
    // TODO: Make ghost text persist upon saving.
    var enteredText = definitionElement.val();
    var autocompleteGhostText = enteredText + definitions[0].substr(enteredText.length);
    autocompleteGhostTextElement.val(autocompleteGhostText);

    textSizerElement.text(autocompleteGhostText);
  }
};

var handleKeyUp = function() {
  var element = $(this);
  var textSizerElement = element.parent().siblings(".the-text");
  var autocompleteGhostTextElement = element.data("autocompleteGhostTextElement");
  if (autocompleteGhostTextElement == null) {
    autocompleteGhostTextElement = $("<textarea>")
        .addClass(AUTOCOMPLETE_GHOST_TEXT_CLASS)
        .insertBefore(element);
    element.data("autocompleteGhostTextElement", autocompleteGhostTextElement);
  }

  // Only replace up to characters typed because otherwise text weights would be strange since ghost
  // text makes regular text bolder.
  var enteredText = element.val();
  var autocompleteGhostText =
      enteredText + autocompleteGhostTextElement.val().substr(enteredText.length);
  autocompleteGhostTextElement.val(autocompleteGhostText);

  // TODO: Remove flash of smaller height.
  textSizerElement.text(autocompleteGhostText);

  var word = element.closest(".text").find(".qWordTextarea").val();
  getDefinitions(
    word,
    function(definitions) {
      onGetDefinitionsSuccess(definitions, textSizerElement, element, autocompleteGhostTextElement);
    });
};

$(function() {
  $(".text").on("keyup", ".qDefTextarea", handleKeyUp);
});