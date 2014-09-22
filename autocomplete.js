var DEFINITIONS_URL = "https://quizlet.com/create-set/autodefine";
var WORD_LANGUAGE = "en";
var DEFINITION_LANGUAGE = "en";

var Autocomplete = function() {
  var wordToDefinitions = {};
  var wordToSuccessFunction = {};

  // TODO: Handle error.
  this.getDefinitions = function(word, onSuccess) {
    var safeWord = safenWord(word);

    if (wordToDefinitions.hasOwnProperty(safeWord)) {
      onSuccess(wordToDefinitions[safeWord]);
      return;
    }

    // Necessary if typing quickly and multiple calls are made before the result is cached.
    if (wordToSuccessFunction.hasOwnProperty(safeWord)) {
      return;
    }

    wordToSuccessFunction[safeWord] = onSuccess;

    $.getJSON(
        DEFINITIONS_URL,
        {
          text: word,
          wordLang: WORD_LANGUAGE,
          defLang: DEFINITION_LANGUAGE
        },
        function(data) {
          var definitions = new Definitions(data.definitions);
          wordToDefinitions[safeWord] = definitions;

          var successFunction = wordToSuccessFunction[safeWord];
          delete wordToSuccessFunction[safeWord];

          successFunction(definitions);
        });
  };

  var safenWord = function(word) {
    return word.trim().toLowerCase();
  };
};

var Definitions = function(definitions) {
  var safeDefinitions = [];

  var init = function() {
    for (var i = 0; i < definitions.length; i++) {
      safeDefinitions.push(safenDefinition(definitions[i]));
    }
  };

  this.findAutocompleteMatch = function(definitionTyped) {
    var safeTypedDefinition = safenDefinition(definitionTyped);

    // TODO: Could be more efficient (e.g., trie). Quizlet only returns about thirty definitions, so
    // it might not be worth it.
    for (var i = 0; i < safeDefinitions.length; i++) {
      var safeDefinition = safeDefinitions[i];

      if (safeDefinition.substr(0, safeTypedDefinition.length) == safeTypedDefinition) {
        return definitions[i];
      }
    }

    return null;
  };

  var safenDefinition = function(definition) {
    return definition.toLowerCase().replace(/[^\w ]/g, '');
  };

  init();
};