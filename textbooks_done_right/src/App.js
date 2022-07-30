import './App.css';
import parse from 'html-react-parser';
//import htmlContent from './raw_book.html';
import book from "./raw_book.jsx";
import { useEffect, useState, createElement } from 'react';
import reactHtmlReplace from 'react-html-replace';
import React, { Component, useMemo } from 'react';
import _ from 'lodash';
import * as ReactDOM from 'react-dom'
import { Virtuoso } from 'react-virtuoso'

import { TWELVE, DummyAhoLinker } from './jentity_linker';

// hewwwuxxxxxxxxxxxx heres an example of how to use my thingy
function TextWithHovers({ text }) {
    const definitions = {
        '12': TWELVE,
        'complex': "a complex number.", // you could also use Symbols here and have your own jsx object stored elsewhere as the definition
        'complex conjugate': "a unary operation that negates the complex component of a complex number."
    };

    const parser = useMemo(() => {
        const linker = new DummyAhoLinker();
        Object.entries(definitions).forEach(([name, def]) => linker.register_definition.apply(linker, [name, def]));
        return linker.find_links.bind(linker);
    }, [definitions]);
    // parser.find_links(text) -> immutable.List([ [beg_idx_inc, end_idx_exc, '12', 'twelve.'], etc ])
    // find_links is as fast as i can think to make it, roughly linear on text.length + sum(definitions.keys().map(length)) possibly still worth useMemo though

    const parsed = useMemo(() => parser(text), [text]);
    console.log(parsed)
    const end_indicies = parsed.map(([b, e, n, d]) => [b, e]).flatten(0);
    const beg_indicies = end_indicies.unshift(0);    // might need to .delete() but thats O(N) => cringe

    console.log('end_indicies', end_indicies)
    console.log('beg_indicies', beg_indicies.toJS())

    const sections = parsed.map(seg => [null, seg]).push(null).flatten(0)   // intersperse with nulls for the non-highlighted sections
        //.zip(beg_indicies, end_indicies).map(([hover, beg, end], i) =>
        //    <span key={i} onMouseEnter={hover ? console.log(hover) : () => {}}>{text.slice(beg, end)}</span>
        //)
        .zip(beg_indicies, end_indicies).map(([hover, beg, end], i) => {
            console.log("eeeeeeeeeee", beg, end, text.slice(beg, end), hover)
            return <span key={i} onMouseEnter={hover ? console.log(hover) : () => {}}>{text.slice(beg, end)}</span>
        })
        .toJS();
    console.log(sections);
    return <div style={{ border: '2px solid red' }}>hewwwwwwwwwwwwwwwww{sections}</div>;

    // sorry if that example wasn't very helpful. i just got in a functional kinda headspace yk
    // the zip offset thing is pretty scuffed i'll admit
    // also the returned segments can overlap, so my example just kinda duplicates the overlapped text. idk how u wanna deal with that
    // the overlap can occur because if you have "real number" and "number equals" in the dictionary, then they might be the same length and it's not clear which one should get a hover. so this example would just spit out <span onHover>real number</span><span onHover>number equals</span>
}

function App() {
    console.log('twelve?', TWELVE);

    return <TextWithHovers text={ `Every real number equals its complex conjugate. Thus if we are dealing with a real vector space, then in the last condition above we can dispense with the complex conjugate.` } />



    const bookParser = (book) => {  // nice -alb
        // UTILS //
        const isObj = (el) => (
            typeof el === 'object' &&
            !Array.isArray(el) &&
            el !== null
        )

        // CHECKS //

        // BLUE //
        let inBlue = false;
        let bIdx = -1;
        let blues = []
        const checkBlue = (obj) => {
            let localVal = null;
            if (obj.props && obj.props.className) {
                if (obj.props.className.split(" ").includes("fca") && inBlue == false) {
                    localVal = "start"
                }

                else if (
                    obj.props.className.split(" ").includes("fc7")
                    || obj.props.className.split(" ").includes("x9")
                    || obj.props.className.split(" ").includes("x69")
                ) {
                    localVal = "end"
                }
            }

            if (localVal === "start") {
                inBlue = true;
                bIdx++;
                blues.push([])
            }

            if (localVal === "end") {
                inBlue = false
            }

            if (inBlue) {
                blues[bIdx].push(obj)
            }

            return localVal
        }

        let defIdx = -1;
        let defs = []
        let inDef = false;

        const checkDef = (obj) => {
            let localVal = null;
            if (obj.props && obj.props.className) {
                if (obj.props.className.split(" ").includes("fc9")) {
                    localVal = "start"
                }

                else if (obj.props.className.split(" ").includes("x4") || obj.props.className.split(" ").includes("x9")  || obj.props.className.split(" ").includes("x69")) {
                    localVal = "end"
                }
            }

            if (localVal === "start") {
                inDef = true;
                defIdx++;
                defs.push([])
            }

            if (localVal === "end") {
                inDef = false
            }

            if (inDef) {
                defs[defIdx].push(obj)
            }
        }


        // MAIN RECURSION LOOP //   // :eyes: -alb
        const search = (obj) => {

            checkBlue(obj);
            checkDef(obj);

            // recurse
            if (obj.props && obj.props.children) {
                if (isObj(obj.props.children)) {
                    search(obj.props.children)
                } else {
                    //if (obj.props.children.push) obj.props.children.push("huh?")
                    for (const i of obj.props.children) {
                        search(i)
                    }
                }
            }
        }

        let repChildren = book.props.children[1].props.children[3].props.children
        book.props.children[1].props.children[3].props.children = [<Virtuoso
            style={{ height: "800px", }}
            totalCount={200}
            //itemContent={(index) => <div>Item {index}</div>}
            itemContent={(index) => {
                return <div style={{minHeight: "1px"}}> {repChildren[index]} </div>
            }}
            />]


        search(book)
        //console.log(blues)
        //console.log(
        //props.children[1].props.children[3].props.children

        //const element = React.createElement(
        //    'h1',
        //    {className: 'greeting'},
        //    'Hello, world!'
        //);

        return book
        //NW TODO: we append the page svgs
    }

    const [foundBlues, setBlues] = useState([]);
    const [displayParsed, setParsed] = useState("");

    const reconstruct = (book) => {
        return _.cloneDeep(book)
        //return book
    }

    useEffect(() => {
        let parsed = reconstruct(parse(book))
        setParsed(bookParser(parsed))
    }, [])

    //{foundBlues.map((blue, idx) => {
    //    return blue.map((el, idx) => {
    //        return el
    //    })}
    //)}

    return (
        <>
        {/*return <Virtuoso
    style={{ height: "400px", }}
    totalCount={200000}
    itemContent={(index) => <div>Item {index}</div>}
  />*/}
        {displayParsed}
        </>
    );
}

export default App;
