export const TWELVE = 'twelve.';    // very important

import spacy from 'spacy-js';

// ideating
// hash-trie of lematized words that refer to other words? for quick search
// eg. "commutativity of scalar addition" -> { addition: { scalar: commutativity: Symbol } }
//
// but how to deal with associativity?
// commutativity of (scalar addition) vs smt else??
// (conjugate symmetry) of (inner products), vs conjugate (symmetry of inner products)
//
// maybe i'll need to store serialized keys as trees... but lets see whether we can even do lemmatization, POS, and referencing first

// looks like spacy has dependency parsing ... but the js package still runs nlp in python ... figures
//
//
// options for nlp libs
// - spacy: js integration is scuffed, certainly need a python server somewhere; spacy-js seems broken so lets try spacy-nlp
// - wink-nlp: js first, but it certainly isn't as complete as spacy and may not have dependencies... i suspect wink won't be able to get us dependencies
// - compromise (https://github.com/spencermountain/compromise): browser first, similar limitations to wink (but it looks like an even smaller ecosystem). compromise has a limited wordlist so it probably won't be able to lemmatize textbooks which have obscure words

class Linker {
    constructor() {
        this.dictionary = {};
        this.match_trie = {};
    }
    async parse_text(text) {
        // TODO
    }
    async register_definition(name, definition) {
        const sem = parse_text(name);
        this.dictionary[name] = definition;

        for (const tok of sem) {    // or smt TODO
            this.match_trie[tok] = 3;   // TOOD
        }
    }
}

const linker = new Linker();
const text = `Every real number equals its com- plex conjugate. Thus if we are dealing with a real vector space, then in the last condition above we can dispense with the complex conjugate.`;

import spacyNLP from 'spacy-nlp';
// default port 6466
// start the server with the python client that exposes spacyIO (or use an existing socketIO server at IOPORT)
var serverPromise = spacyNLP.server({ port: process.env.IOPORT });
// Loading spacy may take up to 15s

//(async function() {
//    const nlp = spacy.load('en_core_web_sm');
//    const doc = await nlp('This is a text about Facebook.');
//    for (let ent of doc.ents) {
//        console.log(ent.text, ent.label);
//    }
//    for (let token of doc) {
//        console.log(token.text, token.pos, token.head.text);
//    }
//})();
