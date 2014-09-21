var AUTOCOMPLETE_GHOST_TEXT_CLASS = "autocompleteGhostText";

var autocomplete = new Autocomplete();

var onGetDefinitionsSuccess = function(
    definitions,
    textSizerElement,
    definitionElement,
    autocompleteGhostTextElement) {

  var enteredText = definitionElement.val();
  var autocompleteMatch = definitions.findAutocompleteMatch(enteredText);

  // TODO: Make ghost text persist upon saving.
  var autocompleteGhostText =
      enteredText + (autocompleteMatch == null ? "" : autocompleteMatch.substr(enteredText.length));
  autocompleteGhostTextElement.val(autocompleteGhostText);
  textSizerElement.text(autocompleteGhostText);
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
  autocomplete.getDefinitions(
    word,
    function(definitions) {
      onGetDefinitionsSuccess(definitions, textSizerElement, element, autocompleteGhostTextElement);
    });
};

$(function() {
  $(".text").on("keyup", ".qDefTextarea", handleKeyUp);
});